import React from 'react';
import CustomModal from './CustomModal';
import css from './LoginErrorModal.module.css';
import Img from '../Images/Fire.png';


const LoginErrorModal = ({ isOpen, onClose }) => {
   
 
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.Container}>
        
            <img src={Img} alt="img error" className={css.img} />
        
       
            <h2 className={css.title}>Fire!</h2>
            <p className={css.text}>Your login or password is incorrect</p>
            <button className={css.button} onClick={onClose}>Back</button>
        </div>         
   
    </CustomModal>
  );
};

export default LoginErrorModal;