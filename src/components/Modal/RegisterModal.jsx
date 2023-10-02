import React from 'react';
import CustomModal from './CustomModal';

const RegisterModal = ({ isOpen, onClose }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {/* Содержимое модального окна для регистрации */}
      <h2>Register</h2>
      {/* Форма для регистрации */}
    </CustomModal>
  );
};

export default RegisterModal;