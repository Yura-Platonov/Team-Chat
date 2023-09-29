import React, { useState } from 'react';
import RoomList from '../RoomList/RoomList';
import CreateRoom from '../CreateRoom/CreateRoom';
import css from './Main.module.css';

function Main() {
  const [rooms, setRooms] = useState([]);
  
  const addRoom = (newRoom) => {
    setRooms([...rooms, newRoom]);
  };

  return (
    <div>
      <section className={css.welcome}>
        <h1 className={css.welcome_title}>Welcome every tourist to Teamchat</h1>
        <p className={css.welcome_text}>Chat about a wide variety of tourist equipment.<br/>Communicate, get good advice and choose!</p>
      </section>
      
      <RoomList rooms={rooms} />
      <CreateRoom onRoomCreated={addRoom} />
    </div>
  );
}

export default Main;
