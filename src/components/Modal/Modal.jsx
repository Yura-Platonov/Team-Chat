import React from 'react';
import Modal from 'react-modal';
import css from './CustomModal.module.css';



const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Custom Modal"
      className={css.modal}
      >
      <button onClick={onClose}>Закрыть</button>
      {children}
    </Modal>
  );
};

export default CustomModal;