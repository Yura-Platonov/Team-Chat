import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import validationSchema from '../ValidationSchema/validationSchema';
import css from './RegistrationForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../LoginForm/AuthContext';

const RegistrationForm = (props) => {
  const [user_name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const auth = useAuth();

  useEffect(() => {
    axios
      .get('https://cool-chat.club/images/Avatar')
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

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleAvatarChange = (selectedOption, index) => {
    setSelectedAvatar(selectedOption);
    setActiveCardIndex(index);
  };

  const handleSubmit = async () => {
    if (!user_name || !email || !password || !confirmPassword || !selectedAvatar) {
      alert('Please fill in all fields and select an avatar before submitting the form.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const existingUsers = await axios.get('https://cool-chat.club/users/');

      if (existingUsers.data.some((user) => user.email === email)) {
        alert('Email is already in use. Please choose another email.');
        return;
      }

      const avatar = selectedAvatar.value;
      const response = await axios.post('https://cool-chat.club/users/', {
        user_name,
        email,
        password,
        avatar,
      });

      if (response.status === 201) {
        console.log(response.data);
        auth.login(response.data.token, email);

        setUserName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSelectedAvatar(null);
        setActiveCardIndex(0);

        console.log('Registration successful! You are now logged in.');
        props.onClose();
      } else {
        alert('Registration failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Check your information and try again.');
    }
  };

  return (
    <Formik
      initialValues={{
        user_name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
    >
      <Form className={css.registerForm}>
        <h2 className={css.title}>Register in TeamChat</h2>
        <div>
          <label htmlFor="email" className={css.text}>
            Enter your email*
          </label>
          <Field
            className={css.input}
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="name@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <ErrorMessage name="email" component="div" />
        </div>
        <div>
          <label htmlFor="password" className={css.text}>
            Come up with a password*
            <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </label>
          <Field
            className={css.input}
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="**********"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <ErrorMessage name="password" component="div" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={css.text}>
            Confirm password*
            <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </label>
          <Field
            className={css.input}
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="**********"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <ErrorMessage name="confirmPassword" component="div" />
        </div>
        <div>
          <label htmlFor="user_name" className={css.text}>
            Enter your nickname*
          </label>
          <Field
            className={css.input}
            type="text"
            id="user_name"
            name="user_name"
            autoComplete="off"
            placeholder="Nikoletta"
            onChange={(e) => setUserName(e.target.value)}
            value={user_name}
          />
          <ErrorMessage name="user_name" component="div" />
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
                onClick={() => handleAvatarChange(avatarOption, index)}
              >
                <img src={avatarOption.value} alt={avatarOption.label} className={css.avatarImage} />
              </div>
            ))}
          </div>
        </div>
        <div className={css.buttonsContainer}>
          <button className={css.button} type="button" onClick={handleSubmit}>
            Approve
          </button>
          <button type="button" className={css.buttonLink} onClick={props.showLoginForm}>
            Already registered
          </button>
        </div>
      </Form>
    </Formik>
  );
}  


export default RegistrationForm;

