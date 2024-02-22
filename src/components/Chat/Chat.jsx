import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import css from './Chat.module.css';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';


const Chat = () => {
  const [message, setMessage] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const { roomName } = useParams();
  const token = localStorage.getItem('access_token');
  const userListRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  let userName = selectedUser ? selectedUser.user_name : '';

  const handleDirectMessageClick = () => {
    console.log(`Direct message to ${selectedUser.user_name}`);
    const token = localStorage.getItem('access_token');
    console.log(selectedUser);
    let partnerId = selectedUser.receiver_id; 
    localStorage.setItem('currentPartnerId', partnerId);
    console.log(partnerId);


    const socket = new WebSocket(`wss://cool-chat.club/private/${partnerId}?token=${token}`);
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      navigate(`/Personalchat/${userName}`);
    };
  };

  const handleCloseMenu = () => {
    setSelectedUser(null);
  };

  const socket = useMemo(() => new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`), [
    roomName,
    token,
  ]);

  const handleAvatarClick = (userData) => {
    setSelectedUser(userData);
   
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

          const newMessage = {
            sender,
            avatar,
            message,
            formattedDate,
            receiver_id,
          };

          setMessages(prevMessages => [...prevMessages, newMessage]);

          setHasMessages(true);

          prevReceiverIdRef.current = receiver_id;
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

    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
                >
                <img src={userData.avatar} alt={`${userData.user_name}'s Avatar`} className={css.user_avatar} />
                <span className={css.user_name}>{userData.user_name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={css.chat_container}>
           <div className={css.chat_area} ref={messageContainerRef}>
            {isDataReady && !hasMessages && (
              <div className={css.no_messages}>
                <img src={Bg} alt="No messages" className={css.no_messagesImg} />
                <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
              </div>
            )}

              {messages.map((msg, index) => (
                <div key={index} className={css.chat_message}>
                  <div className={css.chat}>
                    <img
                      src={msg.avatar}
                      alt={`${msg.sender}'s Avatar`}
                      className={css.chat_avatar}
                      onClick={() => handleAvatarClick({  user_name: msg.sender, avatar: msg.avatar, receiver_id: msg.receiver_id })}
                    />
                    <div className={css.chat_div}>
                      <div className={css.chat_nicktime}>
                        <span className={css.chat_sender}>{msg.sender}</span>
                        <span className={css.time}>{msg.formattedDate}</span>
                      </div>
                      <span className={css.messageText}>{msg.message}</span>
                    </div>
                  </div>
                </div>
              ))}

              {selectedUser && (
                
                  <div className={css.userMenu}>
                    <p>Write a direct message to {userName}</p>
                    <button onClick={handleDirectMessageClick}>Write a direct message</button>
                    <button onClick={handleCloseMenu}>Close</button>
                  </div>
              
              )}

          </div>
          <div className={css.input_container}>
            <input type="text" value={message} onChange={handleMessageChange} placeholder="Write message" className={css.input_text} />
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
