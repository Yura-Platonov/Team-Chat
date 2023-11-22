
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateRoomModal from '../Modal/CreateRoomModal';
import css from './CreateRoom.module.css';
import IconAdd from 'components/Images/IconAdd.svg';
// import IconPeopleAll from 'components/Images/IconPeopleAll.svg';
// import IconPeopleOnline from 'components/Images/IconPeopleOnline.svg';
import CreateRoomImg from 'components/Images/CreateRoomImg.png';

import { useAuth } from '../LoginForm/AuthContext'; 



function CreateRoom({ onRoomCreated }) {
  const { authToken } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [roomImage, setRoomImage] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  
  useEffect(() => {
    axios.get('https://cool-chat.club/images/Home')
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
      alert('You are not authorized. Please login.');
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
      .post('https://cool-chat.club/rooms/', { name_room: roomName, image_room: roomImage }, { headers })
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

  const closeCreateRoomModal = () => {
    setIsCreateRoomModalOpen(false);
  };

  return (
    <div className={css.room_item} onClick={() => openCreateRoomModal()}>
    <div className={css.room_container}>
      <img
        src={CreateRoomImg}
        alt="CreateRoomImg"/>
    <div className={css.room_add}>
        <img
        src={IconAdd}
        alt="IconAdd"/>
        <p className={css.room_name}>Add room</p>
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
    </div>
    <div className={css.room_description}>
          <div className={css.people_count}>
          {/* <img
              src={IconPeopleAll}
              alt="IconPeopleAll"/>
            <span>0</span>
            </div>
            <div className={css.people_count}>
            <img
              src={IconPeopleOnline}
              alt="IconPeopleOnline"/>
            <span>0</span> */}
          </div>
        </div>
    </div>
  );
}

export default CreateRoom;