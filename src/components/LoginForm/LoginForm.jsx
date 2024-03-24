import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import css from './LoginForm.module.css';

import { useAuth } from './AuthContext'; // Изменил импорт на использование useAuth хука
import LoginErrorModal from '../Modal/LoginErrorModal';

const validationSchema = yup.object().shape({
  username: yup.string()
    .test('is-valid-email', 'Please input correct email', value => {
      return (
        value && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
      );
    })
    .required('Email is required'),

  password: yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s)/,
      'Use at least one: (0-9), (a-z), (A-Z), (@#$%^&+=!)'
    )
    .max(8, 'Password must be at most 8 characters long'),
});

const LoginForm = ({ onClose, showRegistrationForm }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
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
            url: 'https://cool-chat.club/api/login',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
          };

          const response = await axios(options);

          if (response.status === 200) {
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token); // Сохраняем refresh token

            login(access_token, refresh_token, values.username); // Обновленный вызов функции login с передачей refresh token
            onClose();
            console.log('User logged in');
          } else {
            setShowLoginErrorModal(true);
          }
        } catch (error) {
          console.error('Error during login:', error.message);
          setShowLoginErrorModal(true);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className={css.loginForm}>
          <h2 className={css.title}>Log in to Coolchat</h2>
          <div>
            <label htmlFor="username" className={css.text}>
              Login
            </label>
            <Field
              className={`${touched.username && errors.username ? css.isInvalid : touched.username ? css.isValid : ''} ${css.input}`}
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
              className={`${touched.password && errors.password ? css.isInvalid : touched.password ? css.isValid : ''} ${css.input}`}
              placeholder="Enter your password"
            />
            <ErrorMessage name="password" component="div" />
          </div>
          <div  className={css.linksContainer}>
            <a  className={css.forgotPass} href="/">Forgot password</a>
          </div>
          <div className={css.buttonsContainer}>
            <button type="submit" className={css.button}>
              Log in
            </button>
            <button type="button" className={css.buttonLink} onClick={showRegistrationForm}>
              Register
            </button>
          </div>
          {showLoginErrorModal && <LoginErrorModal isOpen={true} onClose={() => setShowLoginErrorModal(false)} />}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
