//login form component
import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import validationSchema from '../ValidationSchema/validationSchema';
import axios from 'axios';
import './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



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

  // Обработчик отправки формы
  handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Отправляем данные на сервер с использованием Axios
      const response = await axios.post('http://35.228.45.65:8800/login', values);

      if (response.status === 200) {
        // Обработка успешного ответа от сервера
        alert('You have successfully logged in!');
      } else {
        // Обработка ошибки от сервера
        alert('Incorrect login or password');
      }
    } catch (error) {
      // Обработка сетевой ошибки
      alert('A network error has occurred. Please try again later.');
    }

    // Сброс флага submitting после завершения отправки
    setSubmitting(false);
  }

  render() {
    return (
      <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={this.handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="email">Email:</label>
          <Field type="email" id="email" name="email" />
          <ErrorMessage name="email" component="div" />
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

export default LoginForm;