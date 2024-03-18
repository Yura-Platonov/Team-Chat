import { useState } from 'react';

const useLoginModal = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false); 

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegistrationSuccess = () => {
    setShowVerificationModal(true);
  };

  return { isLoginModalOpen, openLoginModal, closeLoginModal,handleRegistrationSuccess,showVerificationModal, setShowVerificationModal };
};

export default useLoginModal;
