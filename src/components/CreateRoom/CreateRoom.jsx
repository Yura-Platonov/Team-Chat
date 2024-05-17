import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateRoomModal from '../Modal/CreateRoomModal';
import css from './CreateRoom.module.css';
import IconAdd from 'components/Images/IconAdd.svg';
import CreateRoomImg from 'components/Images/CreateRoomImg.png';
import LoginModal from '../Modal/LoginModal';
import VerificationEmailModal from '../Modal/VerificationEmailModal';
import useLoginModal from '../Hooks/useLoginModal';

import { useAuth } from '../LoginForm/AuthContext';



function CreateRoom({ onRoomCreated }) {
  const { authToken } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [roomImage, setRoomImage] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const { isLoginModalOpen, openLoginModal, closeLoginModal,handleRegistrationSuccess,showVerificationModal, setShowVerificationModal} = useLoginModal();

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

  const handleCreateRoom = () => {
    if (!authToken) {
      openLoginModal(); 
      return;
    }

    if (!roomName || roomName.trim() === '') {
      alert('Please provide the room name.');
      return;
    }

    if (!selectedOption) {
      alert('Please select an image for the room.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .post('https://cool-chat.club/api/rooms/', { name_room: roomName, image_room: roomImage }, { headers })
      .then((response) => {
        console.log('Комната создана:', response.data);
        setRoomName('');
        setRoomImage('');
        setSelectedOption(null);
        setIsCreateRoomModalOpen(false);
        onRoomCreated(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при создании комнаты:', error);
      });
  };

  const openCreateRoomModal = () => {
    setIsCreateRoomModalOpen(true);
  };

  const closeCreateRoomModal = (e) => {
    e.stopPropagation()
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
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess}/>
      <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
    </>
  );
}

export default CreateRoom;