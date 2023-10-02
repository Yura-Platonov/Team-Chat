import React from 'react';
import Modal from 'react-modal';


const CustomModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Custom Modal"
    >
      <button onClick={onClose}>Закрыть</button>
      {children}
    </Modal>
  );
};

export default CustomModal;
