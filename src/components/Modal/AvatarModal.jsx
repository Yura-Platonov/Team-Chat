import React from 'react';
import CustomModal from './CustomModal';
import { useAuth } from '../LoginForm/AuthContext';
import css from './AvatarModal.module.css';
import Img from '../Images/UvU.png';


const AvatarModal = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        onClose();
      };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.Container}>
        
            <img src={Img} alt="img animal" className={css.img} />
        
        <div>
            <h2 className={css.title}>UHOO!</h2>
            <p className={css.text}>Are you sure you want to leave the TeamChat?</p>
            <button className={css.button} onClick={handleLogout}>Log out</button>
        </div>         
      </div>
    </CustomModal>
  );
};

export default AvatarModal;
