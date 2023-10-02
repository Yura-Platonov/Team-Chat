import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import validationSchema from '../ValidationSchema/validationSchema';
import axios from 'axios';
// import css from'./RegistrationForm.module.css';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    // Инициализируем состояние (state) компонента
    this.state = {
      username: '',
      email: '',
      password: '',
    };
  }

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
            <label htmlFor="username">Username:</label>
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
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    );
  }
}

export default RegistrationForm;
