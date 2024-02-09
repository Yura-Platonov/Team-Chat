import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import css from './Chat.module.css';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';
import UserMenu from './UserMenu';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [userList, setUserList] = useState([]);
  const { roomName } = useParams();
  const token = localStorage.getItem('access_token');
  const userListRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ posX: 0, posY: 0 });

  const socket = useMemo(() => new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`), [
    roomName,
    token,
  ]);

  const handleAvatarClick = (userData, e) => {
    setSelectedUser(userData);
    setMenuPosition({ posX: e.clientX, posY: e.clientY });
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };


  const formatTime = (created) => {
    const dateTime = new Date(created);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (isToday(dateTime)) {
      return format(dateTime, 'HH:mm');
    } else if (isYesterday(dateTime)) {
      return `yesterday ${format(dateTime, 'HH:mm')}`;
    } else {
      return format(dateTime, 'dd MMM HH:mm');
    }
  };

  const prevReceiverIdRef = useRef(null);

  useEffect(() => {
    socket.onopen = () => {
      console.log('Connected to the server via WebSocket');
    };
  
    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        console.log('Received message:', messageData);
  
        if (messageData.type === 'active_users') {
          setUserList(messageData.data);
        } else {
          const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message } = messageData;
          const formattedDate = formatTime(created_at);
  
          const newMessageElement = document.createElement('div');
          newMessageElement.classList.add(css.chat_message);
          newMessageElement.dataset.sender = sender;
          newMessageElement.innerHTML = `
            <div class="${css.chat}">
              <img src="${avatar}" alt="${sender}'s Avatar" class="${css.chat_avatar}" />
              <div class="${css.chat_div}">
                <div class="${css.chat_nicktime}">
                  <span class="${css.chat_sender}">${sender}</span>
                  <span class="${css.time}">${formattedDate}</span>
                </div>
                <span class="${css.messageText}">${message}</span>
              </div>
            </div>
          `;
          newMessageElement.addEventListener('click', handleAvatarClick);
  
          setHasMessages(true);
  
          if (prevReceiverIdRef.current === receiver_id) {
            messageContainerRef.current.appendChild(newMessageElement);
          } else {
            messageContainerRef.current.appendChild(newMessageElement);
          }
  
          prevReceiverIdRef.current = receiver_id;

          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [roomName, socket]);

  useEffect(() => {
    setIsDataReady(true);
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageObject = {
        message: message,
      };

      const messageString = JSON.stringify(messageObject);
      socket.send(messageString);

      setMessage('');
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Topic: {roomName}</h2>
      <div className={css.main_container}>
        <div className={css.members_container}>
          <h3 className={css.members_title}>Chat members</h3>
          <ul ref={userListRef} className={css.userList}>
            {userList.map((userData) => (
              <li key={userData.user_name} className={css.userItem}
              onClick={(e) => handleAvatarClick(userData, e.clientX, e.clientY)}>
                <img src={userData.avatar} alt={`${userData.user_name}'s Avatar`} className={css.user_avatar}/>
                <span className={css.user_name}>{userData.user_name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={css.chat_container}>
        {showMenu && selectedUser && (
         <UserMenu
         selectedUser={selectedUser}
         onClose={handleCloseMenu}
         posX={menuPosition.posX}
         posY={menuPosition.posY}
       />
      )}
          
          <div className={css.chat_area} ref={messageContainerRef}>
            {isDataReady && !hasMessages && (
              <div className={css.no_messages}>
                <img src={Bg} alt="No messages" className={css.no_messagesImg}/>
                <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
              </div>
            )}
          </div>
          <div className={css.input_container}>
            <input type="text" value={message} onChange={handleMessageChange} placeholder="Write message" className={css.input_text}/>
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