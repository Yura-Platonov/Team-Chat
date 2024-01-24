// import React, { useState, useEffect } from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import axios from 'axios';
// import * as yup from 'yup';
// import css from './RegistrationForm.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import { useAuth } from '../LoginForm/AuthContext';


// const validationSchema = yup.object().shape({
//   user_name: yup.string().required('Username is required').matches(
//     /^[a-zA-Z\u0430-\u044F\u0410-\u042F\u0456\u0406\u0457\u0407\u0491\u0490\u0454\u0404\u04E7\u04E6 ()_.]+$/,
//     'Please input correct Username'
//   ),

//   email: yup.string()
//   .test('is-valid-email', 'Please input correct email', value => {
//     return (
//       value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
//     );
//   })
//   .required('Email is required'),   

//   password: yup.string()
//   .required('Password is required')
//   .matches(
//     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s)/,
//     'Use at least one: (0-9), (a-z), (A-Z), (@#$%^&+=!)'
//   )
//   .max(8, 'Password must be at most 8 characters long'),

//   confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
// });

// const RegistrationForm = (props) => {
//   const [user_name, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [imageOptions, setImageOptions] = useState([]);
//   const [activeCardIndex, setActiveCardIndex] = useState(0);
//   const auth = useAuth();

//   useEffect(() => {
//     axios
//       .get('https://cool-chat.club/images/Avatar')
//       .then((response) => {
//         const imageOptions = response.data.map((avatar) => ({
//           value: avatar.images,
//           label: (
//             <div>
//               <img src={avatar.images} alt={avatar.image_room} width="50" height="50" />
//               {avatar.image_room}
//             </div>
//           ),
//         }));
//         setImageOptions(imageOptions);
//       })
//       .catch((error) => {
//         console.error('Error loading images:', error);
//       });
//   }, []);

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   const handleAvatarChange = (selectedOption, index) => {
//     setSelectedAvatar(selectedOption);
//     setActiveCardIndex(index);
//   };

//   const handleSubmit = async () => {
//     // if (!user_name || !email || !password || !confirmPassword || !selectedAvatar) {
//     //   alert('Please fill in all fields and select an avatar before submitting the form.');
//     //   return;
//     // }

//     // if (password !== confirmPassword) {
//     //   alert('Passwords do not match.');
//     //   return;
//     // }

//     try {
//       const existingUsers = await axios.get('https://cool-chat.club/users/');

//       if (existingUsers.data.some((user) => user.email === email)) {
//         alert('Email is already in use. Please choose another email.');
//         return;
//       }

//       const avatar = selectedAvatar.value;
//       const response = await axios.post('https://cool-chat.club/users/', {
//         user_name,
//         email,
//         password,
//         avatar,
//       });

//       if (response.status === 201) {
//         console.log(response.data);
//         auth.login(response.data.token, email);

//         setUserName('');
//         setEmail('');
//         setPassword('');
//         setConfirmPassword('');
//         setSelectedAvatar(null);
//         setActiveCardIndex(0);

//         console.log('Registration successful! You are now logged in.');
//         props.onClose();
//       } else {
//         alert('Registration failed. Please check your information and try again.');
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//       alert('Check your information and try again.');
//     }
//   };

//   return (
//     <Formik
//       initialValues={{
//         user_name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//       }}
//       validationSchema={validationSchema}
//     >
//        {({ errors, touched}) => (
//       <Form className={css.registerForm}>
//         <h2 className={css.title}>Register in TeamChat</h2>
//         <div>
//           <label htmlFor="email" className={css.text}>
//             Enter your email*
//           </label>
//           <Field
//             className={`${touched.email && errors.email ? css.isInvalid : touched.email ? css.isValid : ''} ${css.input}`}
//             type="email"
//             id="email"
//             name="email"
//             autoComplete="email"
//             placeholder="name@gmail.com"
//             // onChange={(e) => setEmail(e.target.value)}
//             // value={email}
//           />
//           <ErrorMessage name="email" component="div" />
//         </div>
//         <div>
//           <label htmlFor="password" className={css.text}>
//             Come up with a password*
//             <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
//               <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
//             </span>
//           </label>
//           <Field
//             className={`${touched.password && errors.password ? css.isInvalid : touched.password ? css.isValid : ''} ${css.input}`}
//             type={showPassword ? 'text' : 'password'}
//             id="password"
//             name="password"
//             autoComplete="new-password"
//             placeholder="**********"
//             // onChange={(e) => setPassword(e.target.value)}
//             // value={password}
//           />
//           <ErrorMessage name="password" component="div" />
//         </div>
//         <div>
//           <label htmlFor="confirmPassword" className={css.text}>
//             Confirm password*
//             <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
//               <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
//             </span>
//           </label>
         
//             <Field
//             className={`${touched.confirmPassword && errors.confirmPassword ? css.isInvalid : touched.confirmPassword ? css.isValid : ''} ${css.input}`}
//               type={showPassword ? 'text' : 'password'}
//               id="confirmPassword"
//               name="confirmPassword"
//               autoComplete="new-password"
//               placeholder="**********"
//               // onChange={(e) => setConfirmPassword(e.target.value)}
//               // value={confirmPassword}
//             />
//             <ErrorMessage name="confirmPassword" component="div" />
//         </div>
//         <div>
//           <label htmlFor="user_name" className={css.text}>
//             Enter your nickname*
//           </label>
//           <Field
//             className={`${touched.user_name && errors.user_name ? css.isInvalid : touched.user_name ? css.isValid : ''} ${css.input}`}
//             type="text"
//             id="user_name"
//             name="user_name"
//             autoComplete="off"
//             placeholder="Nikoletta"
//             // onChange={(e) => setUserName(e.target.value)}
//             // value={user_name}
//           />
//           <ErrorMessage name="user_name" component="div" />
//         </div>
//         <div>
//           <label className={css.text1}>Choose your avatar*</label>
//           <div className={css.avatarContainer}>
//             {imageOptions.map((avatarOption, index) => (
//               <div
//                 key={index}
//                 className={`${css.avatarCard} ${
//                   index === activeCardIndex ? css.active : ''
//                 }`}
//                 onClick={() => handleAvatarChange(avatarOption, index)}
//               >
//                 <img src={avatarOption.value} alt={avatarOption.label} className={css.avatarImage} />
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className={css.buttonsContainer}>
//           <button className={css.button} type="button" onClick={handleSubmit}>
//             Approve
//           </button>
//           <button type="button" className={css.buttonLink} onClick={props.showLoginForm}>
//             Already registered
//           </button>
//         </div>
//       </Form> 
//       )}
//     </Formik>
//   );
// };


// export default RegistrationForm;

// import React, { useEffect, useState } from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import axios from 'axios';
// import * as yup from 'yup';
// import css from './RegistrationForm.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import { useAuth } from '../LoginForm/AuthContext';

// const validationSchema = yup.object().shape({
//   user_name: yup.string().required('Username is required').matches(
//     /^[a-zA-Z\u0430-\u044F\u0410-\u042F\u0456\u0406\u0457\u0407\u0491\u0490\u0454\u0404\u04E7\u04E6 ()_.]+$/,
//     'Please input correct Username'
//   ),

//   email: yup.string()
//     .test('is-valid-email', 'Please input correct email', value => (
//       value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
//     ))
//     .required('Email is required'),

//   password: yup.string()
//     .required('Password is required')
//     .matches(
//       /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s)/,
//       'Use at least one: (0-9), (a-z), (A-Z), (@#$%^&+=!)'
//     )
//     .max(8, 'Password must be at most 8 characters long'),

//   confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
// });

// const RegistrationForm = (props) => {
//   const auth = useAuth();

//   const [user_name, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [ setConfirmPassword] = useState('');

//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [imageOptions, setImageOptions] = useState([]);
//   const [activeCardIndex, setActiveCardIndex] = useState(0);


//   useEffect(() => {
//     axios
//       .get('https://cool-chat.club/images/Avatar')
//       .then((response) => {
//         const imageOptions = response.data.map((avatar) => ({
//           value: avatar.images,
//           label: (
//             <div>
//               <img src={avatar.images} alt={avatar.image_room} width="50" height="50" />
//               {avatar.image_room}
//             </div>
//           ),
//         }));
//         setImageOptions(imageOptions);
//       })
//       .catch((error) => {
//         console.error('Error loading images:', error);
//       });
//   }, []);

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   const handleAvatarChange = (selectedOption, index) => {
//     setSelectedAvatar(selectedOption);
//     setActiveCardIndex(index);
//   };

 

//   return (
//     <Formik
//         initialValues={{
//               user_name: '',
//               email: '',
//               password: '',
//               confirmPassword: '',
//             }}
//       validationSchema={validationSchema}
//       onSubmit={async () => {
//         console.log('Form values:', user_name,email,password);

//         try {
//           const existingUsers = await axios.get('https://cool-chat.club/users/');
    
//           if (existingUsers.data.some((user) => user.email === email)) {
//             alert('Email is already in use. Please choose another email.');
//             return;
//           }
    
//           const avatar = selectedAvatar.value;
//           const response = await axios.post('https://cool-chat.club/users/', {
//             user_name,
//             email,
//             password,
//             avatar,
//           });
    
//           if (response.status === 201) {
//             console.log(response.data);
//             auth.login(response.data.token, email);
    
//             setUserName('');
//             setEmail('');
//             setPassword('');
//             setConfirmPassword('');
//             setSelectedAvatar(null);
//             setActiveCardIndex(0);
    
//             console.log('Registration successful! You are now logged in.');
//             props.onClose();
//           } else {
//             alert('Registration failed. Please check your information and try again.');
//           }
//         } catch (error) {
//           console.error('Error during registration:', error);
//           alert('Check your information and try again.');
//         }
//       }}
//     >
//       {({ errors, touched }) => (
//         <Form className={css.registerForm}>
//           <h2 className={css.title}>Register in TeamChat</h2>
//           <div>
//             <label htmlFor="email" className={css.text}>
//               Enter your email*
//             </label>
//             <Field
//               className={`${touched.email && errors.email ? css.isInvalid : touched.email ? css.isValid : ''} ${css.input}`}
//               type="email"
//               id="email"
//               name="email"
//               autoComplete="email"
//               placeholder="name@gmail.com"
//             />
//             <ErrorMessage name="email" component="div" className={css.errorMessage} />
//           </div>
//           <div>
//             <label htmlFor="password" className={css.text}>
//               Come up with a password*
//               <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
//                 <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
//               </span>
//             </label>
//             <Field
//               className={`${touched.password && errors.password ? css.isInvalid : touched.password ? css.isValid : ''} ${css.input}`}
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               autoComplete="new-password"
//               placeholder="**********"
//             />
//             <ErrorMessage name="password" component="div" className={css.errorMessage} />
//           </div>
//           <div>
//             <label htmlFor="confirmPassword" className={css.text}>
//               Confirm password*
//               <span onClick={togglePasswordVisibility} className={css.passwordToggleIcon}>
//                 <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
//               </span>
//             </label>

//             <Field
//               className={`${touched.confirmPassword && errors.confirmPassword ? css.isInvalid : touched.confirmPassword ? css.isValid : ''} ${css.input}`}
//               type={showPassword ? 'text' : 'password'}
//               id="confirmPassword"
//               name="confirmPassword"
//               autoComplete="new-password"
//               placeholder="**********"
//             />
//             <ErrorMessage name="confirmPassword" component="div" className={css.errorMessage} />
//           </div>
//           <div>
//             <label htmlFor="user_name" className={css.text}>
//               Enter your nickname*
//             </label>
//             <Field
//               className={`${touched.user_name && errors.user_name ? css.isInvalid : touched.user_name ? css.isValid : ''} ${css.input}`}
//               type="text"
//               id="user_name"
//               name="user_name"
//               autoComplete="off"
//               placeholder="Nikoletta"
//             />
//             <ErrorMessage name="user_name" component="div" className={css.errorMessage} />
//           </div>
//           <div>
//             <label className={css.text1}>Choose your avatar*</label>
//             <div className={css.avatarContainer}>
//               {imageOptions.map((avatarOption, index) => (
//                 <div
//                   key={index}
//                   className={`${css.avatarCard} ${
//                     index === activeCardIndex ? css.active : ''
//                   }`}
//                   onClick={() => handleAvatarChange(avatarOption, index)}
//                 >
//                   <img src={avatarOption.value} alt={avatarOption.label} className={css.avatarImage} />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className={css.buttonsContainer}>
//             <button
//               className={css.button}
//               type="submit"
//               // onClick={handleSubmit}
//             >
//               Approve
//             </button>
//             <button type="button" className={css.buttonLink} onClick={props.showLoginForm}>
//               Already registered
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default RegistrationForm;

import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import css from './RegistrationForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../LoginForm/AuthContext';

const validationSchema = yup.object().shape({
  user_name: yup.string().required('Username is required').matches(
    /^[a-zA-Z\u0430-\u044F\u0410-\u042F\u0456\u0406\u0457\u0407\u0491\u0490\u0454\u0404\u04E7\u04E6 ()_.]+$/,
    'Please input correct Username'
  ),

  email: yup.string()
    .test('is-valid-email', 'Please input correct email', value => (
      value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
    ))
    .required('Email is required'),

  password: yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s)/,
      'Use at least one: (0-9), (a-z), (A-Z), (@#$%^&+=!)'
    )
    .max(8, 'Password must be at most 8 characters long'),

  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const RegistrationForm = (props) => {
  const auth = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

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

  return (
    <Formik
      initialValues={{
        user_name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        console.log('Form values:', values);
        try {
          const existingUsers = await axios.get('https://cool-chat.club/users/');

          if (existingUsers.data.some((user) => user.email === values.email)) {
            alert('Email is already in use. Please choose another email.');
            return;
          }

          const avatar = selectedAvatar.value;
          const response = await axios.post('https://cool-chat.club/users/', {
            user_name: values.user_name,
            email: values.email,
            password: values.password,
            avatar,
          });

          if (response.status === 201) {
            console.log(response.data);
            auth.login(response.data.token, values.email);

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
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className={css.registerForm}>
          <h2 className={css.title}>Register in TeamChat</h2>
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