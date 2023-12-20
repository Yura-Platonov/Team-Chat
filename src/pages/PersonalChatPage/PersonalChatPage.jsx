import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonalChatImg from '../../components/Images/PersonalChatImg.png';
import { Link } from 'react-router-dom';
import BgPersonalChat  from 'components/Images/BgPersonalChat.jpg';

import css from './PersonalChatPage.module.css';

const ChatCard = ({ messageData }) => {
  const {  recipient_id, recipient_name, recipient_avatar, is_read } = messageData;

  const handleChatCardClick = () => {
    localStorage.setItem('currentPartnerId', recipient_id);
  };


  return (
    <Link to={`/Personalchat/${recipient_name}`} className={css.chatCard} onClick={handleChatCardClick}>
      <img src={BgPersonalChat} alt="фон" className={css.bg} />
      <div className={css.avatarBorder}>
      <img src={recipient_avatar} alt={`${recipient_name}'s Avatar`} className={css.avatar} />
      </div>
      <div className={css.info}>
        <p className={css.userName}>{recipient_name}</p>
        <div className={css.unreadMsg}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="22" viewBox="0 0 28 22"  fill={is_read ? "#F5FBFF" : "#E02849"} >
          <rect width="28" height="22" rx="4" fill="current"/>
          <path d="M4.00391 3.88227L11.5507 9.74214C12.9942 10.8629 15.0137 10.8629 16.4571 9.74214L24.0039 3.88227" stroke="#024A7A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p className={css.unreadMsgText}>{`${is_read ? 0 : 1}`}</p>
        </div>

      </div>
    </Link>
  );
};

const PersonalChatPage = () => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  // const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
            try {
              const userObjectString = localStorage.getItem('user');
              const userObject = JSON.parse(userObjectString);
      
              if (userObject && userObject.username) {
                const username = userObject.username;
                console.log('Username:', username);
      
                const response = await axios.get(`https://cool-chat.club/users/${encodeURIComponent(username)}`);
                const userData = response.data;
                const userIdFromResponse = userData.id;
                setUserId(userIdFromResponse);
      
              } else {
                console.error('User object or username not found in local storage');
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          };
      
          fetchData();
        }, []);
      

  useEffect(() => {
    const fetchPrivateMessages = async () => {
      try {
        if (userId) {
          console.log('Fetching private messages for userId:', userId);
          const response = await axios.get(`https://cool-chat.club/direct/${userId}`);
          const data = response.data;
          setPrivateMessages(data);

          // Вывести данные в консоль
          console.log('Received private messages data:', data);
        }
      } catch (error) {
        console.error('Error fetching private messages:', error);
      } finally {
        console.log(123);
      }
    };

    if (userId !== null) {
      fetchPrivateMessages();
    }
  }, [userId]);

  return (
    <div className={css.container}>
      <h2 className={css.title}>Your personal chats</h2>
      <div className={css.chatList}>
        {privateMessages.length > 0 ? (
          privateMessages.map((message) => (
            <ChatCard key={message.recipient_id} messageData={message} />
          ))
        ) : (
          <div className={css.noChats_container}>
            <img className={css.noChats_img} src={PersonalChatImg} alt="Personal Chat Img" />
            <p className={css.noChats_text}>Your personal chats will be here soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalChatPage;
