import React, { useState, useContext } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
// import validationSchema from '../ValidationSchema/validationSchema';
import axios from 'axios';
import * as yup from 'yup';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import css from './LoginForm.module.css';

import AuthContext from './AuthContext';

const validationSchema = yup.object().shape({
  username: yup.string()
  .test('is-valid-email', 'Incorrect email', value => {
    return (
      value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
    );
  })
  .required('Email is required'),

  password: yup.string()
  .min(8, 'Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,'Password must contain at least one uppercase letter, one lowercase letter, and one digit')
  .required('Password is required'),
  });

const LoginForm = ({ onClose, showRegistrationForm }) => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const data = qs.stringify({
            username: values.username,
            password: values.password,
          });

          const options = {
            method: 'POST',
            url: 'https://cool-chat.club/login',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
          };

          const response = await axios(options);

          if (response.status === 200) {
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);

            login(access_token, values.username);
            onClose();
            console.log('User logged in');
          } else {
            alert('Incorrect login or password');
          }
        } catch (error) {
          console.log(error.message);
          alert('Incorrect login or password');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched}) => (
        <Form className={css.loginForm}>
        <h2 className={css.title}>Log in to TeamChat</h2>
        <div>
          <label htmlFor="username" className={css.text}>
            Login
          </label>
          <Field
            // className={` ${touched.username && errors.username ? css.isInvalid : css.isvalid} ${css.input}`}
            className={`${touched.username && errors.username ? css.isInvalid : touched.username ? css.isvalid : ''} ${css.input}`}
            type="text"
            id="username"
            name="username"
            autoComplete="email"
            placeholder="name@gmail.com"
          />
          <ErrorMessage name="username" component="div" />
        </div>
        <div>
          <label htmlFor="password" className={css.text}>
            Password
            <span
              onClick={togglePasswordVisibility}
              className={css.passwordToggleIcon}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </label>
          <Field
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            autoComplete="current-password"
            // className={` ${touched.password && errors.password ? css.isInvalid : css.isvalid} ${css.input}`}
            className={`${touched.password && errors.password ? css.isInvalid : touched.password ? css.isvalid : ''} ${css.input}`}
            placeholder="Enter your password"
          />
          <ErrorMessage name="password" component="div" />
        </div>
        <div className={css.buttonsContainer}>
          <button type="submit" className={css.button}>
            Log in
          </button>
          <button type="button" className={css.buttonLink} onClick={showRegistrationForm}>
            Register
          </button>
        </div>
      </Form>
      
      )}
    </Formik>
  );
};

export default LoginForm;