import React from 'react';
// import { Outlet } from 'react-router';

import css from './PersonalChat.module.css';

function PersonalChat() {
  return (
    <div>
      <section className={css.welcome}>
        <h1 className={css.welcome_title}>Welcome every tourist <br/> to Teamchat</h1>
        <p className={css.welcome_text}>Chat about a wide variety of tourist equipment.<br/>Communicate, get good advice and choose!</p>
      </section>
      
      
    </div>
    
  );
}

export default PersonalChat;