import React, { useEffect, useState} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import css from './RegistrationForm.module.css';
import useDebounce from 'components/Hooks/useDebounce';
import { useAuth } from '../LoginForm/AuthContext';


const RegistrationForm = (props) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [userNameValue, setUserNameValue] = useState('');
  const [userEmailValue, setUserEmailValue] = useState('');
  const debouncedUserName = useDebounce(userNameValue, 1500);
  const debouncedUserEmail = useDebounce(userEmailValue, 1500);
  const [isUserNameUnique, setIsUserNameUnique] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/api/images/Avatar`)
      .then((response) => {
        const imageOptions = response.data.map((avatar) => ({
          value: avatar.images,
          label: (
            <div>
              <img src={avatar.images} alt={avatar.image_room} width="50" height="50" />
              {avatar.image_room}
            </div>
          ),
        }));
        setImageOptions(imageOptions);
      })
      .catch((error) => {
        console.error('Error loading images:', error);
      });
  }, []);

  useEffect(() => {
    console.log('Debounced user name:', debouncedUserName);
    const checkUserNameUnique = async () => {
      if (!debouncedUserName) return; 
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users/audit/${debouncedUserName}`);
        setIsUserNameUnique(response.status === 204);
      } catch (error) {
        console.error('Error checking username uniqueness:', error);
      }
    };
    checkUserNameUnique();
  }, [debouncedUserName]);

  useEffect(() => {
    console.log('Debounced user email:', debouncedUserEmail);

    const checkEmailUnique = async () => {
      if (!debouncedUserEmail) return;
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users/${debouncedUserEmail}`);
        setIsEmailUnique(response.status === 204); 
      } catch (error) {
        console.error('Error checking email uniqueness:', error);
      }
    };
    checkEmailUnique();
  }, [debouncedUserEmail]);
  

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleAvatarChange = (selectedOption, index) => {
    setSelectedAvatar(selectedOption);
    setActiveCardIndex(index);
  };

  const [defaultAvatar] = imageOptions;

  useEffect(() => {
    if (imageOptions.length > 0) {
      setSelectedAvatar(defaultAvatar);
      setActiveCardIndex(0);
    }
  }, [defaultAvatar, imageOptions]);

  const validationSchema = yup.object().shape({
    user_name: yup.string().required('Username is required').matches(
      /^[a-zA-Z\u0430-\u044F\u0410-\u042F\u0456\u0406\u0457\u0407\u0491\u0490\u0454\u0404\u04E7\u04E6 ()_.]+$/,
      'Please input correct Username'
    ).test('checkUsernameUnique', 'Username already exists', () => isUserNameUnique),
  
    email: yup.string()
    .test('is-valid-email', 'Please input correct email', value => (
      value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
    ))
    .required('Email is required')
    .test('checkEmailUnique', 'Email already exists', () => isEmailUnique),
  
    password: yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s)/,
        'Use at least one: (0-9), (a-z), (A-Z), (@#$%^&+=!)'
      )
      .max(8, 'Password must be at most 8 characters long'),
  
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  });

  

  return (
    <Formik
      initialValues={{
        user_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: defaultAvatar ? defaultAvatar.value : null,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
           const avatar = selectedAvatar.value;
          const response = await axios.post(`${apiBaseUrl}/api/users/`, {
            user_name: values.user_name,
            email: values.email,
            password: values.password,
            avatar,
          });

          if (response.status === 201) {
            const registeredEmail = values.email;

            try {
              const data = qs.stringify({
                username: registeredEmail,
                password: values.password,
              });

              const options = {
                method: 'POST',
                url: `${apiBaseUrl}/api/login`,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                data,
              };

              const loginResponse = await axios(options);

              if (loginResponse.status === 200) {
                const { access_token, refresh_token } = loginResponse.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token); 
              
                login(access_token, refresh_token, registeredEmail);
                console.log('User logged in after registration');
                props.onClose();
              } else {
                alert('Login after registration failed');
              }
              props.onRegistrationSuccess();
            } catch (error) {
              console.log(error.message);
            }
          } else {
            alert('Registration failed. Please check your information and try again.');
          }
        } catch (error) {
          console.error('Error during registration:', error);
          alert('Check your information and try again.');
        } 
      }}

      
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className={css.registerForm}>
          <h2 className={css.title}>Register in Coolchat</h2>
          <div>
            <label htmlFor="email" className={css.text}>
              Enter your email*
            </label>
            <Field
              className={`${touched.email && errors.email ? css.isInvalid : touched.email ? css.isValid : ''} ${css.input}`}
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="name@gmail.com"
              value={userEmailValue} 
              onChange={(e) => {
                setUserEmailValue(e.target.value);
                setFieldValue('email', e.target.value);
              }}
            />
            <ErrorMessage name="email" component="div" className={css.errorMessage} />
          </div>
          <div>
            <label htmlFor="password" className={css.text}>
              Come up with a password*
              <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </label>
            <Field
              className={`${touched.password && errors.password ? css.isInvalid : touched.password ? css.isValid : ''} ${css.input}`}
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="**********"
            />
            <ErrorMessage name="password" component="div" className={css.errorMessage} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={css.text}>
              Confirm password*
              <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </label>

            <Field
              className={`${touched.confirmPassword && errors.confirmPassword ? css.isInvalid : touched.confirmPassword ? css.isValid : ''} ${css.input}`}
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="**********"
            />
            <ErrorMessage name="confirmPassword" component="div" className={css.errorMessage} />
          </div>
          <div>
            <label htmlFor="user_name" className={css.text}>
              Enter your nickname*
            </label>
            <Field
              className={`${touched.user_name && errors.user_name ? css.isInvalid : touched.user_name ? css.isValid : ''} ${css.input}`}
              type="text"
              id="user_name"
              name="user_name"
              autoComplete="off"
              placeholder="Nikoletta"
              value={userNameValue} 
              onChange={(e) => {
                setUserNameValue(e.target.value);
                setFieldValue('user_name', e.target.value);
              }}
            />
            <ErrorMessage name="user_name" component="div" className={css.errorMessage} />
          </div>
          <div>
            <label className={css.text1}>Choose your avatar*</label>
            <div className={css.avatarContainer}>
              {imageOptions.map((avatarOption, index) => (
                <div
                  key={index}
                  className={`${css.avatarCard} ${
                    index === activeCardIndex ? css.active : ''
                  }`}
                  onClick={() => {
                    handleAvatarChange(avatarOption, index);
                    setFieldValue('avatar', avatarOption.value);
                  }}
                >
                  <img src={avatarOption.value} alt={avatarOption.label} className={css.avatarImage} />
                </div>
              ))}
            </div>
          </div>
          <div className={css.buttonsContainer}>
            <button
              className={css.button}
              type="submit"
            >
              Approve
            </button>
            <button type="button" className={css.buttonLink} onClick={props.showLoginForm}>
              Already registered
            </button>
          </div>

        </Form>
      )}

    </Formik>
  );
};

export default RegistrationForm;
