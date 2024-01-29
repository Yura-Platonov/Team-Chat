import React from 'react';
// import { Outlet } from 'react-router';

import RoomList from '../RoomList/RoomList';
import css from './Main.module.css';

function Main() {
  return (
    <div>
      <section className={css.welcome}>
        <h1 className={css.welcome_title}>Welcome every tourist <br/> to Coolchat</h1>
        <p className={css.welcome_text}>Chat about a wide variety of tourist equipment.<br/>Communicate, get good advice and choose!</p>
      </section>
      
      <RoomList />
      
    </div>
    
  );
}

export default Main;
