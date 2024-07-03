import React from 'react';
import CustomModal from './CustomModal';
import css from './DeleteRoomFromTabModal.module.css';

const DeleteRoomFromTabModal = ({
  isOpen,
  onClose,
  onConfirmDelete
 }) => {

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
    <div className={css.createRoomContainer}>
      <h2 className={css.title}>Are you sure you want to delete 
      the selected rooms?</h2>
      <div className={css.center}>
        <button className={css.cancelButton} onClick={onClose} >
        Cancel
        </button>
        <button className={css.confirmButton} onClick={onConfirmDelete}  >
        Delete rooms
        </button>
      </div>
    </div>
  </CustomModal>
);
};

export default DeleteRoomFromTabModal;