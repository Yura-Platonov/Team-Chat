import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import css from './RoomList.module.css';
import CreateRoom from 'components/CreateRoom/CreateRoom';
import Heart from 'components/Images/Heart.svg';
import IconPeopleOnline from 'components/Images/IconPeopleOnline.svg';

function RoomList() {
  const [rooms, setRooms] = useState([]);

  const loadRooms = () => {
    axios.get('https://cool-chat.club/rooms/')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке списка комнат:', error);
      });
  };

  useEffect(() => {

    loadRooms();
  }, []); 

  const addRoom = (newRoom) => {
    setRooms([...rooms, newRoom]);
  };

  return (
  <div className={css.room_section}>
    <h2 className={css.room_title}>Choose a room for <br/> communication</h2>
    <ul className={css.room_list}>
      {rooms.map((room) => (
        <li className={css.room_item} key={room.id}>
          <Link to={`/chat/${room.name_room}`}>
            <div className={css.room_container}>
              <img className={css.room_img} src={room.image_room} alt={room.name_room} />
              <p className={css.room_name}>{room.name_room}</p>
            </div>
            <div className={css.room_description}>
              <div className={css.people_count}>
                <img src={Heart} alt="favorites"/>
                
              </div>
              <div className={css.people_count}>
                <img src={IconPeopleOnline} alt="IconPeopleOnline" />
                
              </div>
            </div>
          </Link>
        </li>
      ))}
      <li className={css.room_item}>
        <CreateRoom onRoomCreated={addRoom} />
      </li>
    </ul>
  </div>
);
}

export default RoomList;