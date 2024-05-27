import React from 'react';
import CustomModal from './CustomModal';
import css from './VerificationUserModal.module.css';
import { ReactComponent as VerifyImg} from '../Images/VerifyModal.svg'; 


const VerificationUserModal = ({ isOpen, onClose }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user ? (user.username) : null;

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.container}>
        
      <VerifyImg className={css.verifyImg}/>
          <h2 className={css.title}>To create your room, please verify your email</h2>
        
          <p className={css.text}>The instruction was send to {email} immediatly after registration in the app</p>
          <button className={css.button} onClick={onClose}>OK</button>
          <a href='*'>Benefits of a verified user</a>
        </div>
      
    </CustomModal>
  );
};

export default VerificationUserModal;
