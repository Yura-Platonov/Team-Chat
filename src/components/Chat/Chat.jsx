import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import css from './Chat.module.css';
import axios from 'axios';
import LoginModal from '../Modal/LoginModal';
import VerificationEmailModal from '../Modal/VerificationEmailModal';
import useLoginModal from '../Hooks/useLoginModal';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';

const Chat = () => {
  const [message, setMessage] = useState('');
  // const [hasMessages, setHasMessages] = useState(false);
  // const [isDataReady, setIsDataReady] = useState(false);
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const { roomName } = useParams();
  const token = localStorage.getItem('access_token');
  const userListRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  let userName = selectedUser ? selectedUser.user_name : '';
  const [currentUserId] = useState(localStorage.getItem('user_id'));

  const { isLoginModalOpen, openLoginModal, closeLoginModal,handleRegistrationSuccess,showVerificationModal, setShowVerificationModal} = useLoginModal();

  const handleDirectMessageClick = () => {
    if (!token) {
      openLoginModal();
      return;
    }

    console.log(`Direct message to ${selectedUser.user_name}`);
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

   const prevReceiverIdRef = useRef(null);

  const socketRef = useRef(null); 

  useEffect(() => {
    if (!token) {
      axios.get(`https://cool-chat.club/api/messages/${roomName}?limit=50&skip=0`)
        .then(response => {
          const formattedMessages = response.data.map(messageData => {
            const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message } = messageData;
            const formattedDate = formatTime(created_at);
    
            return {
              sender,
              avatar,
              message,
              formattedDate,
              receiver_id,
            };
          });
  
          setMessages(prevMessages => [...prevMessages, ...formattedMessages]);
          // setHasMessages(true);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    } else {
      const socket = new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`);
      socketRef.current = socket;
  
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
            const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, id, vote } = messageData;
            const formattedDate = formatTime(created_at);
  
            const newMessage = {
              sender,
              avatar,
              message,
              id,
              vote,
              formattedDate,
              receiver_id,
            };
  
            setMessages(prevMessages => [...prevMessages, newMessage]);
            // setHasMessages(true);
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
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close();
        }
      };
    }
  }, [roomName, token]);
  

  useEffect(() => {
    // setIsDataReady(true);

    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (!token) {
      openLoginModal();
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageObject = {
        message: message,
      };
  
      const messageString = JSON.stringify(messageObject);
      socketRef.current.send(messageString);
  
      setMessage('');
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
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

  const handleAvatarClick = (userData) => {
    setSelectedUser(userData);
  };

  // const handleLikeClick = (id) => {
  //   console.log('Message ID:', id); 

  //   const requestData = {
  //       message_id: id,
  //       dir: 1
  //     };
  
  //     // const requestData = {
  //     //   "vote": {
  //     //     message_id: id,
  //     //     dir: 1
  //     //     }
  //     //   };

  //   console.log('Request data:', requestData);
  //   axios.post('https://cool-chat.club/api/vote/', requestData, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //     .then(response => {
  //       console.log('Vote successful:', response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error liking message:', error);
  //     });
  // };
  
  const handleLikeClick = (id, vote) => {
    console.log('Message ID:', id); 
    console.log('vote:', vote); 
  
    let dir = 1; // По умолчанию ставим лайк
  
    // Если поле vote равно 1, значит, пользователь уже поставил лайк на сообщение, и нужно удалить его
    if (vote === 1) {
      dir = 0; // Устанавливаем значение dir равным 0 для удаления лайка
    }
  
    const requestData = {
      message_id: id,
      dir: dir // Значение dir для установки или удаления лайка
    };
  
    console.log('Request data:', requestData);
  
    axios.post('https://cool-chat.club/api/vote/', requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Vote successful:', response.data);
    })
    .catch(error => {
      console.error('Error liking message:', error);
    });
  };
  

  return (
    <div className={css.container}>
      <h2 className={css.title}>Topic: {roomName}</h2>
      <div className={css.main_container}>
        <div className={css.members_container}>
          <h3 className={css.members_title}>Chat members</h3>
          <ul ref={userListRef} className={css.userList}>
            {userList.map((userData) => (
              <li key={userData.user_name} className={css.userItem}>
                <div className={css.user_avatarBorder}>
                  <img src={userData.avatar} alt={`${userData.user_name}'s Avatar`} className={css.user_avatar} />
                </div>
                <span className={css.user_name}>{userData.user_name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={css.chat_container}>
          <div className={css.chat_area} ref={messageContainerRef}>
          { messages.length === 0 && (
            <div className={css.no_messages}>
              <img src={Bg} alt="No messages" className={css.no_messagesImg} />
              <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
            </div>
          )}
             {messages.map((msg, index) => (
              <div key={index} className={`${css.chat_message} ${parseInt(currentUserId) === parseInt(msg.receiver_id) ? css.my_message : ''}`}>
                <div className={css.chat}>
                  <img
                    src={msg.avatar}
                    alt={`${msg.sender}'s Avatar`}
                    className={css.chat_avatar}
                    onClick={() => handleAvatarClick({ user_name: msg.sender, avatar: msg.avatar, receiver_id: msg.receiver_id })}
                  />
                  <div className={css.chat_div}>
                    <div className={css.chat_nicktime}>
                      <span className={css.chat_sender}>{msg.sender}</span>
                      <span className={css.time}>{msg.formattedDate}</span>
                    </div>
                    <p className={css.messageText}>{msg.message}</p>
                    <div className={css.actions}>
                    
        <button onClick={() => handleLikeClick(msg.id, msg.vote)}>Like</button>
      
          </div>
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
            <input type="text" value={message} onChange={handleMessageChange} onKeyDown={handleKeyDown} placeholder="Write message" className={css.input_text} />
            <button onClick={sendMessage} className={css.button_send}>Send</button>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess}/>
      <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
    </div>
  );
};

export default Chat;
