import React from 'react';
import CustomModal from './CustomModal';
import css from './VerificationEmailModal.module.css';


const VerificationEmailModal = ({ isOpen, onClose }) => {
  // Получение имени пользователя и аватара из локального хранилища
  const user_name = localStorage.getItem('user_name');
  const avatar = localStorage.getItem('avatar');

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.container}>
        
          <div className={css.avatarBorder}>
            <img src={avatar} alt="User Avatar" className={css.avatar} />
           </div>
       
        
          <h2 className={css.title}>Hello, <span className={css.accent}>{user_name}</span>!</h2>
          <h3 className={css.subtitle}>Welcome to the CoolChat</h3>
          <p className={css.text}>Open the letter in your mail, go through verification and get the opportunity to use the additional features of CoolChat</p>
          <button className={css.button} onClick={onClose}>Close</button>
        </div>
      
    </CustomModal>
  );
};

export default VerificationEmailModal;
