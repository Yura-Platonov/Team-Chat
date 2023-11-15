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
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.loginModal}>
      {isLoginFormVisible ? (
        <LoginForm showRegistrationForm={showRegistrationForm} onClose={onClose} />
      ) : (
        <RegistrationForm showLoginForm={showLoginForm} onClose={onClose} />
      )}
    </CustomModal>
  );
};

export default LoginModal;
