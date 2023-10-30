import React, { useState, useEffect } from 'react';
import css from './Chat.module.css';
import Bg from '../Images/Bg_empty_chat.png'
import io from 'socket.io-client';

const Chat = () => {
  const [chatMembers, setChatMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 

  const token = localStorage.getItem('access_token');
  const roomName = 'Holl';

  const socket = io('https://cool-chat.club/${roomName}?token=${token}');
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server via WebSocket');
    });
  
    socket.on('message', (message) => {
      const newMessage = { text: message, sender: 'User' };
      addMessage(newMessage);
    });
  
    return () => {
      socket.disconnect();
    };
  }, [token, roomName]);
  

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    
    socket.emit('sendMessage', message); 
    
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
