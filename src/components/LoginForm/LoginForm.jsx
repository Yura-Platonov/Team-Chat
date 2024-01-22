// import React, { Component } from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import validationSchema from '../ValidationSchema/validationSchema';
// import axios from 'axios';
// import qs from 'qs';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import css from './LoginForm.module.css';

// import AuthContext from './AuthContext';



// class LoginForm extends Component {
//   constructor(props) {
//     super(props);

//     // Инициализируем состояние (state) компонента
//     this.state = {
//       username: '',
//       password: '',
//       showPassword: false,
      
//       };
//   }
  

//   togglePasswordVisibility = () => {
//     this.setState((prevState) => ({
//       showPassword: !prevState.showPassword,
//     }));
//   };
     
//   handleInputChange = (event) => {
//     const { name, value } = event.target;
//     this.setState({ [name]: value });
//   };
  

// handleOnSubmit = async (values) => {
//   const { username, password } = this.state;

//   if (!username || !password) {
//     alert('Please fill in all fields.');
//     return;
//   }
  
//   try {
//     const data = qs.stringify({
//       username,
//       password,
//     });
 
//     const options = {
//       method: 'POST',
//       url: 'https://cool-chat.club/login',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       data,
//     };
//     const response = await axios(options);

//     if (response.status === 200) {
//       const { access_token } = response.data;
//       localStorage.setItem('access_token', access_token);

      
//       const { login } = this.context;
//       login(access_token, username);
      
//       this.props.onClose(); 

//       console.log('User logged in'); 
      
//     } else {
//       alert('Incorrect login or password');
//     }
//   } catch (error) {
//     console.log(error.message);
//     alert('Incorrect login or password');
//   }

//   return null;
// }


//       render() {
//         return (
//           <Formik
//             initialValues={{ username: '', password: '' }}
//             validationSchema={validationSchema}
            
//           >
//             <Form className={css.loginForm}>
//             <h2 className={css.title}>Log in to TeamChat</h2>
//               <div>
//                 <label htmlFor="username"  className={css.text}>Login</label>
//                 <Field className={css.input} type="text" id="username" name="username" autoComplete="email" placeholder="name@gmail.com" onChange={this.handleInputChange}
//               value={this.state.username}/>
//                 <ErrorMessage name="username" component="div" />
//               </div>
//               <div>
//                 <label   htmlFor="password"  className={css.text}>Password
//                 <span
//                   onClick={this.togglePasswordVisibility}
//                   className={css.passwordToggleIcon}
//                 >
//                   <FontAwesomeIcon
//                     icon={this.state.showPassword ? faEye : faEyeSlash}
//                   />
//                 </span>
//                 </label>
//                 <Field
//                   type={this.state.showPassword ? 'text' : 'password'}
//                   id="password"
//                   name="password"  
//                   autoComplete="current-password"
//                   className={css.input}
//                   placeholder="Enter your password"
//                   onChange={this.handleInputChange} 
//                   value={this.state.password}
//                 />
//                 <ErrorMessage name="password" component="div" />
//               </div>
//               <div className={css.buttonsContainer}>
//               <button type="submit"  className={css.button} onClick={this.handleOnSubmit}>Log in</button>
//               <button type="button"  className={css.buttonLink} onClick={this.props.showRegistrationForm}>Register</button>
//               </div>
//             </Form>
//           </Formik>
//         );
//       }
//     }
    
//     LoginForm.contextType = AuthContext;
    
//     export default LoginForm;

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
  // username:  yup.string().required('Email is required').email('Invalid email format'),
  username:  yup.string().required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long').matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
    ),
});

const LoginForm = ({ onClose, showRegistrationForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleOnSubmit = async () => {
    if (!username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const data = qs.stringify({
        username,
        password,
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

        login(access_token, username);
        onClose();
        console.log('User logged in');
      } else {
        alert('Incorrect login or password');
      }
    } catch (error) {
      console.log(error.message);
      alert('Incorrect login or password');
    }
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
    >
       {({ values, isValid, errors, touched, dirty }) => {
        return (
      <Form className={css.loginForm}>
        <h2 className={css.title}>Log in to TeamChat</h2>
        <div>
          <label htmlFor="username" className={css.text}>Login</label>
          <Field
           className={`${touched.username && !values.username && !isValid ? `${css.isInvalid}` : ''}  ${css.input}`}
            // className={css.input}
            type="text"
            id="username"
            name="username"
            autoComplete="email"
            placeholder="name@gmail.com"
            onChange={handleInputChange}
            value={username}
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
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
              />
            </span>
          </label>
          <Field
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            autoComplete="current-password"
            className={css.input}
            placeholder="Enter your password"
            onChange={handleInputChange}
            value={password}
          />
          <ErrorMessage name="password" component="div" />
        </div>
        <div className={css.buttonsContainer}>
          <button type="submit" className={css.button}>Log in</button>
          <button type="button" className={css.buttonLink} onClick={showRegistrationForm}>Register</button>
        </div>
      </Form>
     );
    }}
  </Formik>
);
};

export default LoginForm;
