import React from 'react';
import CustomModal from './CustomModal';
import css from './VerificationEmailModal.module.css';


const VerificationEmailModal = ({ isOpen, onClose }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.Container}>
        <div>
          <h2 className={css.title}>Welcome to TeamChat!</h2>
          <p className={css.text}>Check email to finish registration!</p>
          <button className={css.button} onClick={onClose}>Close</button>
        </div>
      </div>
    </CustomModal>
  );
};

export default VerificationEmailModal;
