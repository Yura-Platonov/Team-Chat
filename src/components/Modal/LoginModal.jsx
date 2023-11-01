import React, { useState } from 'react';
import CustomModal from './CustomModal';
import css from './LoginModal.module.css';
import LoginForm from 'components/LoginForm/LoginForm';
import RegistrationForm from 'components/RegistrationForm/RegistrationForm';

const LoginModal = ({ isOpen, onClose }) => {
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

  const showLoginForm = () => {
    setIsLoginFormVisible(true);
  };
  
  const showRegistrationForm = () => {
    setIsLoginFormVisible(false);
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
         {isLoginFormVisible ? <LoginForm showRegistrationForm={showRegistrationForm} /> :  <RegistrationForm showLoginForm={showLoginForm} />}
    </CustomModal>
  );
};

export default LoginModal;
