import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateRoomModal from '../Modal/CreateRoomModal';
import css from './CreateRoom.module.css';
import IconAdd from 'components/Images/IconAdd.svg';
import CreateRoomImg from 'components/Images/CreateRoomImg.png';
import LoginModal from '../Modal/LoginModal';
import VerificationEmailModal from '../Modal/VerificationEmailModal';
import VerificationUserModal from 'components/Modal/VerificationUserModal';
import useLoginModal from '../Hooks/useLoginModal';
import { useAuth } from '../LoginForm/AuthContext';

function CreateRoom({ onRoomCreated }) {
  const { authToken } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [roomImage, setRoomImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [isSecretRoom, setIsSecretRoom] = useState(false);
  const [isVerificationUserModalOpen, setIsVerificationUserModalOpen] = useState(false);

  const { isLoginModalOpen, openLoginModal, closeLoginModal, handleRegistrationSuccess, showVerificationModal, setShowVerificationModal } = useLoginModal();

  const openVerificationUserModal = () => {
    setIsVerificationUserModalOpen(true);
  };

  const closeVerificationUserModal = (e) => {
    e.stopPropagation();
    setIsVerificationUserModalOpen(false);
  };

  useEffect(() => {
    axios.get('https://cool-chat.club/api/images/Home')
      .then((response) => {
        setImageOptions(response.data.map((image) => ({
          value: image.images,
          label: (
            <div>
              <img src={image.images} alt={image.image_room} width="50" height="50" />
              {image.image_room}
            </div>
          ),
        })));
      })
      .catch((error) => {
        console.error('Error loading images:', error);
      });
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRoomImage(file);
    }
  };

  const handleCreateRoom = () => {
    if (!authToken) {
      openLoginModal();
      return;
    }

    if (!roomName || roomName.trim() === '') {
      alert('Please provide the room name.');
      return;
    }

    if (!roomImage) {
      alert('Please select an image for the room.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append('name_room', roomName);
    formData.append('file', roomImage);

    axios
      .get('https://cool-chat.club/api/users/me/', { headers: { Authorization: `Bearer ${authToken}` } })
      .then((response) => {
        const isVerified = response.data.verified;

        if (isVerified) {
          const url = `https://cool-chat.club/api/rooms/v2?secret=${isSecretRoom}`;
          axios
            .post(url, formData, { headers })
            .then((response) => {
              console.log('Комната создана:', response.data);
              setRoomName('');
              setRoomImage(null);
              setSelectedOption(null);
              setIsCreateRoomModalOpen(false);
              onRoomCreated(response.data);
            })
            .catch((error) => {
              console.error('Ошибка при создании комнаты:', error);
            });
        } else {
          openVerificationUserModal();
        }
      })
      .catch((error) => {
        console.error('Ошибка при проверке верификации пользователя:', error);
      });
  };

  const openCreateRoomModal = () => {
    setIsCreateRoomModalOpen(true);
  };

  const closeCreateRoomModal = (e) => {
    e.stopPropagation();
    setIsCreateRoomModalOpen(false);
  };

  return (
    <>
      <div className={css.room_item} onClick={() => openCreateRoomModal()}>
        <div className={css.room_container}>
          <img
            src={CreateRoomImg}
            alt="CreateRoomImg"
            className={css.room_img}
          />
          <div className={css.room_add}>
            <img
              src={IconAdd}
              alt="IconAdd"
              className={css.room_imgAdd}
            />
            <p className={css.room_name}>Add room</p>
          </div>
        </div>
        <div className={css.room_description}>
          <div className={css.people_count}>
          </div>
        </div>
      </div>
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={closeCreateRoomModal}
        roomName={roomName}
        setRoomName={setRoomName}
        roomImage={roomImage}
        setRoomImage={setRoomImage}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        imageOptions={imageOptions}
        activeCardIndex={activeCardIndex}
        setActiveCardIndex={setActiveCardIndex}
        handleCreateRoom={handleCreateRoom}
        handleFileChange={handleFileChange}
        isSecretRoom={isSecretRoom}
        setIsSecretRoom={setIsSecretRoom}
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess} />
      <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      <VerificationUserModal isOpen={isVerificationUserModalOpen} onClose={closeVerificationUserModal} />
    </>
  );
}

export default CreateRoom;
