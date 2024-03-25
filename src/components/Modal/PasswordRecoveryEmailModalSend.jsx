import React from 'react';
import CustomModal from './CustomModal';
import css from './PasswordRecoveryEmailModalSend.module.css';
import Img from '../Images/EmailSend.png';


const PasswordRecoveryEmailModalSend = ({ isOpen,email, onClose }) => {



  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.modalContainer}>
        <img src={Img} alt="img email" className={css.img} />
        <p className={css.text}> {email}</p>
        <p className={css.text1}>A password reset link has been sent to the specified e-mail address</p>
      </div>
    </CustomModal>
  );
};


export default PasswordRecoveryEmailModalSend;
