import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonalChatImg from '../../components/Images/PersonalChatImg.png';

import css from './PersonalChat.module.css';

const PersonalChat = () => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
        let username = null; // Задаем изначальное значение username

        const userObjectString = localStorage.getItem('user');
        const userObject = JSON.parse(userObjectString);
        
        if (userObject && userObject.username) {
          username = userObject.username;
          console.log('Username:', username);
        } else {
          console.error('User object or username not found in local storage');
        }

        // Выводим username после блока if
        console.log(username);

      if (username) {
        try {
          const response = await axios.get(`https://cool-chat.club/users/${encodeURIComponent(username)}`);
          const userData = response.data;
          const userIdFromResponse = userData.id;
          setUserId(userIdFromResponse);

          // Создаем сокет только после получения userId
          const newSocket = new WebSocket(`wss://cool-chat.club/private/${userIdFromResponse}?token=${localStorage.getItem('access_token')}`);
          
          // Устанавливаем обработчики событий для WebSocket
          newSocket.onopen = () => {
            console.log('Connected to the server via WebSocket');
          };
  
          newSocket.onmessage = (event) => {
            console.log('Received message:', event.data);
            // Обработка полученных данных, если необходимо
          };
  
          newSocket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
          };
  
          newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
  
          // Сохраняем созданный сокет в состоянии
          setSocket(newSocket);

        } catch (error) {
          console.error('Error fetching user data:', error);
        }
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
      <div className={css.main_container}>
        {privateMessages.length > 0 ? (
          <ul>
            {privateMessages.map((message) => (
              <li key={message.recipient_id}>
                <p>{`Recipient Name: ${message.recipient_name}`}</p>
                <p>{`Recipient Avatar: ${message.recipient_avatar}`}</p>
                <p>{`Is Read: ${message.is_read ? 'Yes' : 'No'}`}</p>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <img className={css.noChats_img} src={PersonalChatImg} alt="Personal Chat Img" />
            <p className={css.noChats_text}>Your personal chats will be here soon</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalChat;
