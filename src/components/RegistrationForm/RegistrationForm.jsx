import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import validationSchema from '../ValidationSchema/validationSchema';
import axios from 'axios';
import css from './RegistrationForm.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import Select from 'react-select';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_name: '',
      email: '',
      password: '',
      showPassword: false,
      selectedAvatar: null, 
      imageOptions: [],
    };
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleAvatarChange = (selectedOption) => {
    this.setState({ selectedAvatar: selectedOption});
  };

  componentDidMount() {
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
        this.setState({ imageOptions });
      })
      .catch((error) => {
        console.error('Error loading images:', error);
      });
  }

  // Обработчик отправки формы
  handleSubmit = async ({ user_name, email, password }) => {
    try {
      if (!this.state.selectedAvatar) {
        alert('Please select an avatar before submitting the form.');
        return;
      }
  
      const avatar = this.state.selectedAvatar.value; // Извлекаем URL из объекта
  
      // Отправляем данные на сервер с использованием Axios
      const response = await axios.post('https://cool-chat.club/users/', {
        user_name,
        email,
        password,
        avatar, 
      });
  
      if (response.status === 201) {
        // Обработка успешного ответа от сервера после регистрации
        alert('Registration successful! You can now log in.');
      } else {
        // Обработка ошибки от сервера
        alert('Registration failed. Please check your information and try again.');
      }
    } catch (error) {
      // Проверьте правильность данных
      alert('Check your information and try again.');
    }
    };
  

  render() {
    return (
      <Formik
        initialValues={{
          user_name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema} 
        onSubmit={this.handleSubmit}
      >
        <Form className={css.registerForm}>
            <div>
            <label htmlFor="email" className={css.text}>Enter your email*</label>
            <Field  className={css.input} type="email" id="email" name="email" placeholder="name@gmail.com" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label htmlFor="password" className={css.text}>Come up with a password*:</label>
            <Field  className={css.input} type={this.state.showPassword ? 'text' : 'password'} id="password" name="password" placeholder="**********"/>
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
            <label htmlFor="confirmPassword" className={css.text}>Confirm password*</label>
            <Field className={css.input} type={this.state.showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" placeholder="**********"/>
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
          <div>
            <label htmlFor="user_name" className={css.text}>Enter your nikname*</label>
            <Field  className={css.input} type="text" id="user_name" name="user_name" placeholder="Nikoletta"/>
            <ErrorMessage name="user_name" component="div" />
          </div>
          {/* <div>
            <label htmlFor="avatar" className={css.text}>Choose your avatar*</label>
            <Select
              value={this.state.selectedAvatar}
              onChange={this.handleAvatarChange}
              options={this.state.imageOptions}
              placeholder="Select an Avatar"
            />
          </div> */}
          <div>
          <label htmlFor="avatar" className={css.text}>Choose your avatar*</label>
          <div className={css.avatarContainer}>
            {this.state.imageOptions.map((avatarOption, index) => (
              <div
                key={index}
                className={css.avatarCard}
                onClick={() => this.handleAvatarChange(avatarOption)}
              >
                <img
                  src={avatarOption.value}
                  alt={avatarOption.label}
                  className={css.avatarImage}
                />
              </div>
            ))}
          </div>
          </div>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    );
  }
}

export default RegistrationForm;
