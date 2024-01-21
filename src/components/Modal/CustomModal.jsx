import React from 'react';
import Modal from 'react-modal';
import css from './CustomModal.module.css';
import Xbutton from '../../components/Images/Xbutton.svg';

const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Custom Modal"
      className={css.modal}
      >
      <button onClick={onClose} className={css.modal_button}>
        <img src={Xbutton} alt="close modal button" />
      </button>
      {children}
    </Modal>
  );
};

export default CustomModal;