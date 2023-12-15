// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import css from './Chat.module.css';
// import { format, isToday, isYesterday } from 'date-fns';
// import Bg from '../Images/Bg_empty_chat.png';

// const PersonalChat = () => {
//   const [message, setMessage] = useState('');
//   const [hasMessages, setHasMessages] = useState(false);
//   const [isDataReady, setIsDataReady] = useState(false);
//   const { roomName } = useParams();
//   const token = localStorage.getItem('access_token');
//   const messageContainerRef = useRef(null);

//   const socket = useMemo(() => new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`), [
//     roomName,
//     token,
//   ]);

//   const formatTime = (created) => {
//     const dateTime = new Date(created);
//     const now = new Date();
//     const yesterday = new Date(now);
//     yesterday.setDate(now.getDate() - 1);

//     if (isToday(dateTime)) {
//       return format(dateTime, 'HH:mm');
//     } else if (isYesterday(dateTime)) {
//       return `yesterday ${format(dateTime, 'HH:mm')}`;
//     } else {
//       return format(dateTime, 'dd MMM HH:mm');
//     }
//   };

//   const prevReceiverIdRef = useRef(null);

//   useEffect(() => {
//     socket.onopen = () => {
//       console.log('Connected to the server via WebSocket');
//     };
  
//     socket.onmessage = (event) => {
//       try {
//         const messageData = JSON.parse(event.data);
//         console.log('Received message:', messageData);
  
//         if (messageData.type === 'active_users') {
//           setUserList(messageData.data);
//         } else {
//           const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message } = messageData;
//           const formattedDate = formatTime(created_at);
  
//           const newMessageElement = document.createElement('div');
//           newMessageElement.classList.add(css.chat_message);
//           newMessageElement.dataset.sender = sender;
//           newMessageElement.innerHTML = `
//             <div class="${css.chat}">
//               <img src="${avatar}" alt="${sender}'s Avatar" class="${css.chat_avatar}" />
//               <div class="${css.chat_div}">
//                 <div class="${css.chat_nicktime}">
//                   <span class="${css.chat_sender}">${sender}</span>
//                   <span class="${css.time}">${formattedDate}</span>
//                 </div>
//                 <span class="${css.messageText}">${message}</span>
//               </div>
//             </div>
//           `;
  
//           setHasMessages(true);
  
//           if (prevReceiverIdRef.current === receiver_id) {
//             messageContainerRef.current.appendChild(newMessageElement);
//           } else {
//             messageContainerRef.current.appendChild(newMessageElement);
//           }
  
//           prevReceiverIdRef.current = receiver_id;

//           messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
//         }
//       } catch (error) {
//         console.error('Error parsing JSON:', error);
//       }
//     };
  
//     socket.onerror = (error) => {
//       console.error('WebSocket Error:', error);
//     };
  
//     return () => {
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         socket.close();
//       }
//     };
//   }, [roomName, socket]);

//   useEffect(() => {
//     setIsDataReady(true);
//   }, []);

//   const handleMessageChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const sendMessage = () => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       const messageObject = {
//         message: message,
//       };

//       const messageString = JSON.stringify(messageObject);
//       socket.send(messageString);

//       setMessage('');
//     } else {
//       console.error('WebSocket is not open. Message not sent.');
//     }
//   };


//   return (
//     <div className={css.container}>
//     <h2 className={css.title}>{`Direct chat: ${recipient_name}`}</h2>
//     <div className={css.main_container}>
//         <div className={css.chat_container}>
//         <div className={css.chat_area} ref={messageContainerRef}>
//           {isDataReady && !hasMessages && (
//             <div className={css.no_messages}>
//               <img src={Bg} alt="No messages" className={css.no_messagesImg}/>
//               <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
//             </div>
//           )}
//         </div>
//         <div className={css.input_container}>
//           <input type="text" value={message} onChange={handleMessageChange} placeholder="Write message" />
//           <button onClick={sendMessage} className={css.button_send}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default PersonalChat;
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

import css from './PersonalChat.module.css';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';

const PersonalChat = () => {
  const [message, setMessage] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [setPrivateMessages] = useState([]);

  const messageContainerRef = useRef(null);

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

  
  // const socket = new WebSocket(`wss://cool-chat.club/private/${userId}?token=${localStorage.getItem('access_token')}`);
  const socket = useMemo(() => new WebSocket(`wss://cool-chat.club/private/${userId}?token=${localStorage.getItem('access_token')}`), [
  userId,
]);

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

        const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, messages } = messageData;
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
              <span class="${css.messageText}">${messages}</span>
            </div>
          </div>
        `;
        
        setHasMessages(true);
        
        if (prevReceiverIdRef.current === receiver_id) {
          messageContainerRef.current.appendChild(newMessageElement);
        } else {
          messageContainerRef.current.appendChild(newMessageElement);
        }
        
        prevReceiverIdRef.current = receiver_id;
        
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
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
  }, [socket]);

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

  useEffect(() => {
    const fetchPrivateMessages = async () => {
      try {
        if (userId) {
          console.log('Fetching private messages for userId:', userId);
          const response = await axios.get(`https://cool-chat.club/direct/${userId}`);
          const data = response.data;
          setPrivateMessages(data);

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
  }, [socket, setPrivateMessages, userId]);

  return (
    <div className={css.container}>
      <h2 className={css.title}>Direct chat: </h2>
      <div className={css.main_container}>
        <div className={css.chat_container}>
          <div className={css.chat_area} ref={messageContainerRef}>
            {isDataReady && !hasMessages && (
              <div className={css.no_messages}>
                <img src={Bg} alt="No messages" className={css.no_messagesImg} />
                <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
              </div>
            )}
          </div>
          <div className={css.input_container}>
            <input type="text" value={message} onChange={handleMessageChange} placeholder="Write message" />
            <button onClick={sendMessage} className={css.button_send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalChat;
