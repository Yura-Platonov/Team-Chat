import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import validationSchema from '../ValidationSchema/validationSchema';
import axios from 'axios';
// import './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import AuthContext from './AuthContext';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    // Инициализируем состояние (state) компонента
    this.state = {
      username: '',
      password: '',
      showPassword: false,
    };
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };


  handleOnSubmit = async (values, { setSubmitting }) => {
    try {
      // Создаем экземпляр URLSearchParams и добавляем в него параметры
      const data = new URLSearchParams();
      data.append('username', values.username);
      data.append('password', values.password);

      // Отправляем POST-запрос на сервер
      const response = await axios.post('http://35.228.45.65:8800/login', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        // Обработка успешного ответа от сервера
        const { access_token } = response.data;

        // Сохраняем access_token в локальном хранилище
        localStorage.setItem('access_token', access_token);
  
        alert('You have successfully logged in!');
      } else {
        // Обработка ошибки аутентификации
        alert('Incorrect login or password');
      }
    } catch (error) {
      // Обработка сетевой ошибки
      alert('A network error has occurred. Please try again later.');
    }
  
    // Сброс флага submitting после завершения отправки
    setSubmitting(false);
  };
  
  // login = (access_token) => {
  //   // Получите функцию setAuthToken из контекста аутентификации
  //   const { setAuthToken } = this.context;
  //   // Установите токен в состоянии LoginForm или делайте другую логику аутентификации по вашему усмотрению
  //   this.setState({ authToken: access_token });
  //   // Установите токен в контекст аутентификации
  //   setAuthToken(access_token);
  // };
  
      render() {
        return (
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={this.handleOnSubmit}
          >
            <Form>
              <div>
                <label htmlFor="username">Email:</label>
                <Field type="text" id="username" name="username" /> 
                <ErrorMessage name="username" component="div" />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <Field
                  type={this.state.showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"  
                />
                <span
                  onClick={this.togglePasswordVisibility}
                  className="password-toggle-icon"
                >
                  <FontAwesomeIcon
                    icon={this.state.showPassword ? faEye : faEyeSlash}
                  />
                </span>
                <ErrorMessage name="password" component="div" />
              </div>
              <button type="submit">Log in</button>
            </Form>
          </Formik>
        );
      }
    }
    
    LoginForm.contextType = AuthContext;
    
    export default LoginForm;