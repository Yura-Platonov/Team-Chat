import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import validationSchema from '../ValidationSchema/validationSchema';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import css from'./RegistrationForm.module.css';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    // Инициализируем состояние (state) компонента
    this.state = {
      username: '',
      email: '',
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
      const response = await axios.post('http://35.228.45.65:8800/register', values);

      if (response.status === 200) {
        // Обработка успешного ответа от сервера после регистрации
        alert('Registration successful! You can now log in.');
      } else {
        // Обработка ошибки от сервера
        alert('Registration failed. Please check your information and try again.');
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
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={validationSchema} // Ваша схема валидации
        onSubmit={this.handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="username">Nickname:</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Field type={this.state.showPassword ? 'text' : 'password'} id="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <span
            onClick={this.togglePasswordVisibility}
            className="password-toggle-icon"
          >
            <FontAwesomeIcon
              icon={this.state.showPassword ? faEye : faEyeSlash}
            />
          </span>
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm password:</label>
            <Field type={this.state.showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" />
            <span
            onClick={this.togglePasswordVisibility}
            className="password-toggle-icon"
          >
            <FontAwesomeIcon
              icon={this.state.showPassword ? faEye : faEyeSlash}
            />
          </span>
          </div>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    );
  }
}

export default RegistrationForm;
