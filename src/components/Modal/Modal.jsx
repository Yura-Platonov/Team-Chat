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


  // const customStyles = {
  //   content: {
  //     width: '400px',
  //     height: '400px',
  //   },
  //   overlay: {
  //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  // };

 
      // style={customStyles}
     
