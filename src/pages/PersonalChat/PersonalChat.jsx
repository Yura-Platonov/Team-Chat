import React from 'react';
import PersonalChatImg from '../../components/Images/PersonalChatImg.png';

import css from './PersonalChat.module.css';

function PersonalChat() {
    return (
        <div className={css.container}>
            <h2 className={css.title}>Your personal chats</h2>
            <div className={css.main_container}>
                <img className={css.noChats_img} src={PersonalChatImg} alt="Personal Chat Img" />
                <p className={css.noChats_text}>Your personal chats will be here soon</p>
            </div>
        </div>
      );
}

export default PersonalChat;