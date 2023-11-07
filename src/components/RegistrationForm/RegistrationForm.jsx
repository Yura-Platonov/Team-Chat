// import React, { Component } from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import validationSchema from '../ValidationSchema/validationSchema';
// import axios from 'axios';
// import css from './RegistrationForm.module.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// // import Select from 'react-select';

// class RegistrationForm extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       user_name: '',
//       email: '',
//       password: '',
//       showPassword: false,
//       selectedAvatar: null, 
//       imageOptions: [],
//       activeCardIndex: 0,
//     };
//   }

//   togglePasswordVisibility = () => {
//     this.setState((prevState) => ({
//       showPassword: !prevState.showPassword,
//     }));
//   };

//   handleAvatarChange = (selectedOption, index) => {
//     this.setState({ selectedAvatar: selectedOption, activeCardIndex: index });
//   };

//   componentDidMount() {
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
//         this.setState({ imageOptions });
//       })
//       .catch((error) => {
//         console.error('Error loading images:', error);
//       });
//   }


//   handleSubmit = async ({ user_name, email, password }) => {
//     // if (!user_name || !email || !password || !this.state.selectedAvatar) {
//     //     alert('Please fill in all fields and select an avatar before submitting the form.');
//     //     return;
//     // }
//     console.log('Data to be sent:', { user_name, email, password, avatar: this.state.selectedAvatar.value });

//     try {
//         const avatar = this.state.selectedAvatar.value;

//         // Отправляем данные на сервер с использованием Axios
//         const response = await axios.post('https://cool-chat.club/users/', {
//             user_name,
//             email,
//             password,
//             avatar,
//         });

//         console.log('Response from the server:', response); // Добавьте эту строку для отладки

//         if (response.status === 201) {
//             // Обработка успешного ответа от сервера после регистрации
//             alert('Registration successful! You can now log in.');
//         } else {
//             // Обработка ошибки от сервера
//             alert('Registration failed. Please check your information and try again.');
//         }
//     } catch (error) {
//         // Проверьте правильность данных
//         console.error('Error during registration:', error); // Добавьте эту строку для отладки
//         alert('Check your information and try again.');
//     }
// };

  

//   render() {
//     return (
//       <Formik
//         initialValues={{
//           user_name: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//         }}
//         validationSchema={validationSchema} 
//         onSubmit={this.handleSubmit}
//       >
//         <Form>
//         <h2 className={css.title}>Register in TeamChat</h2>
//             <div>
//             <label htmlFor="email"  className={css.text}>Enter your email*</label>
//             <Field  className={css.input} type="email" id="email" name="email" autoComplete="email" placeholder="name@gmail.com" />
//             <ErrorMessage name="email" component="div" />
//           </div>
//           <div>
//             <label  htmlFor="password" className={css.text}>Come up with a password*
//             <span
//               onClick={this.togglePasswordVisibility}
//               className={css.passwordToggleIcon}
//             >
//               <FontAwesomeIcon
//                 icon={this.state.showPassword ? faEye : faEyeSlash}
//               />
//             </span>
//             </label>
//             <Field  className={css.input} type={this.state.showPassword ? 'text' : 'password'} id="password" name="password" autoComplete="new-password" placeholder="**********"/>
//             <ErrorMessage name="password" component="div" />
//             </div>
//           <div>
//             <label  htmlFor="confirmPassword" className={css.text}>Confirm password*
//             <span
//               onClick={this.togglePasswordVisibility}
//               className={css.passwordToggleIcon}
//             >
//               <FontAwesomeIcon
//                 icon={this.state.showPassword ? faEye : faEyeSlash}
//               />
//             </span>
//             </label>
//             <Field className={css.input} type={this.state.showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" autoComplete="new-password" placeholder="**********"/>
//             <ErrorMessage name="confirmPassword" component="div" />
//             {/* <span
//               onClick={this.togglePasswordVisibility}
//               className={css.passwordToggleIcon}
//             >
//               <FontAwesomeIcon
//                 icon={this.state.showPassword ? faEye : faEyeSlash}
//               />
//             </span> */}
//           </div>
//           <div>
//             <label htmlFor="user_name" className={css.text}>Enter your nikname*</label>
//             <Field  className={css.input} type="text" id="user_name" name="user_name" autoComplete="off" placeholder="Nikoletta"/>
//             <ErrorMessage name="user_name" component="div" />
//           </div>
//           <div>
//           <label className={css.text1}>Choose your avatar*</label>
//           <div className={css.avatarContainer}>
//             {this.state.imageOptions.map((avatarOption, index) => (
//               <div
//                 key={index}
//                 className={`${css.avatarCard} ${index === this.state.activeCardIndex ? css.active : ''}`}
//                 onClick={() => this.handleAvatarChange(avatarOption, index)}
//               >
//                 <img
//                   src={avatarOption.value}
//                   alt={avatarOption.label}
//                   className={css.avatarImage}
//                 />
//               </div>
//             ))}
//           </div>
//           </div>
//           <div className={css.buttonsContainer}>
//             <button className={css.button} type="submit" onClick={this.handleSubmit}>
//               Approve
//             </button>
//             <button type="button" className={css.buttonLink} onClick={this.props.showLoginForm}>
//               Already registered
//             </button>
//           </div>
//         </Form>
//       </Formik>
//     );
//   }
// }

// export default RegistrationForm;

import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import validationSchema from '../ValidationSchema/validationSchema';
import css from './RegistrationForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      selectedAvatar: null,
      imageOptions: [],
      activeCardIndex: 0,
    };
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleAvatarChange = (selectedOption, index) => {
    this.setState({ selectedAvatar: selectedOption, activeCardIndex: index });
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

  handleSubmit = async () => {
    const { user_name, email, password, confirmPassword, selectedAvatar } = this.state;

    if (!user_name || !email || !password || !confirmPassword || !selectedAvatar) {
      alert('Please fill in all fields and select an avatar before submitting the form.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const avatar = selectedAvatar.value;
      const response = await axios.post('https://cool-chat.club/users/', {
        user_name,
        email,
        password,
        avatar,
      });

      if (response.status === 201) {
        alert('Registration successful! You can now log in.');
        this.setState({
          user_name: '',
          email: '',
          password: '',
          confirmPassword: '',
          selectedAvatar: null,
          activeCardIndex: 0,
        });
      } else {
        alert('Registration failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
      >
        <Form>
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
              onChange={(e) => this.setState({ email: e.target.value })}
              value={this.state.email}
            />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label htmlFor="password" className={css.text}>
              Come up with a password*
              <span onClick={this.togglePasswordVisibility} className={css.passwordToggleIcon}>
                <FontAwesomeIcon icon={this.state.showPassword ? faEye : faEyeSlash} />
              </span>
            </label>
            <Field
              className={css.input}
              type={this.state.showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="**********"
              onChange={(e) => this.setState({ password: e.target.value })}
              value={this.state.password}
            />
            <ErrorMessage name="password" component="div" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={css.text}>
              Confirm password*
              <span onClick={this.togglePasswordVisibility} className={css.passwordToggleIcon}>
                <FontAwesomeIcon icon={this.state.showPassword ? faEye : faEyeSlash} />
              </span>
            </label>
            <Field
              className={css.input}
              type={this.state.showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="**********"
              onChange={(e) => this.setState({ confirmPassword: e.target.value })}
              value={this.state.confirmPassword}
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
              onChange={(e) => this.setState({ user_name: e.target.value })}
              value={this.state.user_name}
            />
            <ErrorMessage name="user_name" component="div" />
          </div>
          <div>
            <label className={css.text1}>Choose your avatar*</label>
            <div className={css.avatarContainer}>
              {this.state.imageOptions.map((avatarOption, index) => (
                <div
                  key={index}
                  className={`${css.avatarCard} ${
                    index === this.state.activeCardIndex ? css.active : ''
                  }`}
                  onClick={() => this.handleAvatarChange(avatarOption, index)}
                >
                  <img src={avatarOption.value} alt={avatarOption.label} className={css.avatarImage} />
                </div>
              ))}
            </div>
          </div>
          <div className={css.buttonsContainer}>
            <button className={css.button} type="button" onClick={this.handleSubmit}>
              Approve
            </button>
            <button type="button" className={css.buttonLink} onClick={this.props.showLoginForm}>
              Already registered
            </button>
          </div>
        </Form>
      </Formik>
    );
  }
}

export default RegistrationForm;
