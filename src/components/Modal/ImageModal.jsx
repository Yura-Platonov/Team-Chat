import React from 'react';
import CustomModal from './CustomModal';
import css from './ImageModal.module.css';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.modalContent}>
        <img src={imageUrl} alt="Full Size" className={css.imageInModal} />
      </div>
    </CustomModal>
  );
};

export default ImageModal;
