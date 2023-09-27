import React, { useState, useEffect } from 'react';
import axios from 'axios';
import css from './RoomList.module.css';

function RoomList() {
  const [rooms, setRooms] = useState([]);

  const loadRooms = () => {
    axios.get('http://35.228.45.65:8800/rooms/')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке списка комнат:', error);
      });
  };

  useEffect(() => {
    // Вызываем функцию загрузки при каждом рендере компонента
    loadRooms();
  }, []); // Пустой массив зависимостей означает, что эффект выполняется при каждом рендере

  return (
    <div>
      <h2 className={css.room_title}>Choose room <br/> for communication</h2>
      <ul className={css.room_list}>
        {rooms.map((room) => (
          <li className={css.room_item} key={room.id}>{room.name_room}
           <img className={css.room_img} src={room.image_room} alt={room.name_room} width="300"/></li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;

