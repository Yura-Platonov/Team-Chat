import * as yup from 'yup';

const validationSchema = yup.object().shape({
  user_name: yup.string().required('Username is required'),
  username:  yup.string().required('Email is required').email('Invalid email format'),
  email: yup.string().required('Email is required')
    .email('Invalid email format'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long').matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit'
    ),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

export default validationSchema;


