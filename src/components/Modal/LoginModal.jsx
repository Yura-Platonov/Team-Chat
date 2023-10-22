import React, { useState } from 'react';
import CustomModal from './Modal';
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
      <h2 className={css.title}>{isLoginFormVisible ? 'Log in to TeamChat' : 'Register in TeamChat'}</h2>
      {isLoginFormVisible ? <LoginForm /> : <RegistrationForm />}

      {isLoginFormVisible ? (
        <div>
          <p>Don't have an account? Register.</p>
          <button onClick={showRegistrationForm}>Register</button>
        </div>
      ) : (
        <div>
          <p>Already have an account? Log in.</p>
          <button onClick={showLoginForm}>Log in</button>
        </div>
      )}
    </CustomModal>
  );
};

export default LoginModal;
