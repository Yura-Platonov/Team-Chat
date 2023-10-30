import React, { useState, useEffect } from 'react';
import axios from 'axios';
import css from './Chat.module.css';
import Bg from '../Images/Bg_empty_chat.png'
import io from 'socket.io-client';

const Chat = ({ roomId }) => {
  const [chatMembers, setChatMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 

  const socket = io('https://cool-chat.club');

  useEffect(() => {
    // Здесь вы можете выполнить запрос к серверу для получения списка участников чата.
    // Используйте roomId для указания нужной комнаты.
    const apiUrl = `https://cool-chat.club/ws/users/${roomId}`;

    axios.get(apiUrl)
      .then((response) => {
        const users = response.data.users;
        setChatMembers(users);
      })
      .catch((error) => {
        console.error('Ошибка при получении списка участников чата:', error);
      });
  }, [roomId]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    // Здесь вы можете отправить сообщение на сервер и добавить его к списку сообщений.
    // Например, можно использовать функцию addMessage, которую вы уже объявили.
    const newMessage = { text: message, sender: 'You' };
    addMessage(newMessage);
    
    setMessage('');
  };

  const addMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Topic: Tourist furniture and tableware</h2>
      <div className={css.main_container}>
        <div className={css.members_container}>
          <h3 className={css.members_title}>Chat members</h3>
          <ul className={css.members_list}>
            {chatMembers.map((member) => (
              <li key={member.id} className={css.members_item}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className={css.avatar}
                />
                {member.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={css.chat_container}>
          <div className={css.chat_area}>
             {messages.length === 0 ? (
              <div className={css.no_messages}>
                <img src={Bg} alt="No messages" />
                <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
              </div>
            ) : (
               messages.map((message, index) => (
                <div key={index} className={css.message}>
                  {message.sender}: {message.text}
                </div>
              ))
            )}
          </div>
          <div className={css.input_container}>
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Write message"
            />
            <button onClick={sendMessage} className={css.button_send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
