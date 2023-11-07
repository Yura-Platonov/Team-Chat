
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import CustomModal from 'components/Modal/CustomModal';
import css from './CreateRoom.module.css';
import IconAdd from 'components/Images/IconAdd.svg';
import IconPeopleAll from 'components/Images/IconPeopleAll.svg';
import IconPeopleOnline from 'components/Images/IconPeopleOnline.svg';
import CreateRoomImg from 'components/Images/CreateRoomImg.png';

import { useAuth } from '../LoginForm/AuthContext'; 

Modal.setAppElement('#root');


function CreateRoom({ onRoomCreated }) {
  const { authToken } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [roomImage, setRoomImage] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen(false);
        onRoomCreated(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при создании комнаты:', error);
      });
  };
  

  return (
    <div className={css.room_item} onClick={() => setIsModalOpen(true)}>
    <div className={css.room_container}>
      <img
        src={CreateRoomImg}
        alt="CreateRoomImg"/>
    <div className={css.room_add}>
        <img
        src={IconAdd}
        alt="IconAdd"/>
        <p className={css.room_name}>Add room</p>
      {/* <button onClick={() => setIsModalOpen(true)}>Open Modal</button> */}
      
      </div>
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className={css.title}>Add a new chat room</h2>
        <label className={css.text}>Name of the chat room*
        <input
          className={css.input}
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        </label>
        <div>
          <label className={css.text1}>Choose a photo of the room*</label>
          <div className={css.roomImgContainer}>
            {imageOptions.map((roomImg, index) => (
              <div
                key={index}
                className={`${css.roomImgCard} ${activeCardIndex === index ? css.active : ''}`}
                onClick={() => {
                  setActiveCardIndex(index);
                  setSelectedOption(roomImg);
                  setRoomImage(roomImg.value);
                }}
              >
                <img src={roomImg.value} alt={roomImg.label} className={css.roomImg} />
              </div>
            ))}
          </div>
        </div>
        <div className={css.center}><button  className={css.button} onClick={handleCreateRoom}>
          Approve
        </button></div>
              </CustomModal>
    </div>
    <div className={css.room_description}>
          <div className={css.people_count}>
          <img
              src={IconPeopleAll}
              alt="IconPeopleAll"/>
            <span>0</span>
            </div>
            <div className={css.people_count}>
            <img
              src={IconPeopleOnline}
              alt="IconPeopleOnline"/>
            <span>0</span>
          </div>
        </div>
    </div>
  );
}

export default CreateRoom;
