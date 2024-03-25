import React from 'react';
import CustomModal from './CustomModal';
import css from './PasswordRecoveryEmailModal.module.css';

const PasswordRecoveryEmailModal = ({ isOpen, onClose }) => {

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.modalContainer}>
        <h2 className={css.title}>Password recovery</h2>
        <p className={css.text1}>Enter your email address below and we will send you an email to reset your password</p>
        <label className={css.text}>
        E-mail
          <input
            className={css.input}
            type="text"
            autoComplete="email"
            placeholder="Indigo@gmail.com"
            
           />
        </label>
        
        <div className={css.center}>
          <button className={css.button} >
          Send
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default PasswordRecoveryEmailModal;
