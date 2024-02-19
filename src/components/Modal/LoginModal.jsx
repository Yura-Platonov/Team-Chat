import React, { useState } from 'react';
import CustomModal from './CustomModal';
import LoginForm from 'components/LoginForm/LoginForm';
import RegistrationForm from 'components/RegistrationForm/RegistrationForm';

const LoginModal = ({ isOpen, onClose, onRegistrationSuccess }) => {
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);

  const showLoginForm = () => {
    setIsLoginFormVisible(true);
  };
  
  const showRegistrationForm = () => {
    setIsLoginFormVisible(false);
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {isLoginFormVisible ? (
        <LoginForm showRegistrationForm={showRegistrationForm} onClose={onClose} />
      ) : (
        <RegistrationForm showLoginForm={showLoginForm} onClose={onClose} onRegistrationSuccess={onRegistrationSuccess}/>
      )}
    </CustomModal>
  );
};

export default LoginModal;
