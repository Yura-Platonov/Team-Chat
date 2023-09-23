//login form component
import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import validationSchema from '../ValidationSchema/validationSchema';
import axios from 'axios';
import './LoginForm.module.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    // Инициализируем состояние (state) компонента
    this.state = {
      username: '',
      password: '',
    };
  }

  // Обработчик отправки формы
  handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Отправляем данные на сервер с использованием Axios
      const response = await axios.post('URL_НАШЕГО_СЕРВЕРА', values);

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
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={this.handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="username">Username:</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit">Log in</button>
        </Form>
      </Formik>
    );
  }
}

export default LoginForm;