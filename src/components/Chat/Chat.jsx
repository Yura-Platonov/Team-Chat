// -----------------------------------------------27.11.2023

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import css from './Chat.module.css';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [userList, setUserList] = useState([]);
  const { roomName } = useParams();
  const token = localStorage.getItem('access_token');
  const userListRef = useRef(null);
  const messageContainerRef = useRef(null);

  const socket = useMemo(() => new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`), [
    roomName,
    token,
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
              <li key={userData.user_name} className={css.userItem}>
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
                <img src={Bg} alt="No messages" />
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

export default Chat;



// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import css from './Chat.module.css';
// import Bg from '../Images/Bg_empty_chat.png';

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [hasMessages, setHasMessages] = useState(false);
//   const [isDataReady, setIsDataReady] = useState(false);
//   const { roomName } = useParams();
//   const token = localStorage.getItem('access_token');
//   const userListRef = useRef(null);

//   const socket = useMemo(() => new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`), [roomName, token]);

//   useEffect(() => {
//     const handleSocketOpen = () => {
//       console.log('Connected to the server via WebSocket');
//       setIsDataReady(true);
//     };

//     const handleSocketMessage = (event) => {
//       try {
//         const messageData = JSON.parse(event.data);
//         console.log('Received message:', messageData);

//         if (messageData.type === 'active_users') {
//           const userListItems = userListRef.current.getElementsByTagName('li');
//           Array.from(userListItems).forEach(item => {
//             userListRef.current.removeChild(item);
//           });

//           messageData.data.forEach(userData => {
//             const userItem = document.createElement('li');
//             userItem.classList.add(`${css.userItem}`);
//             userItem.innerHTML = `<img src="${userData.avatar}" alt="${userData.user_name}'s Avatar" class="${css.user_avatar}" /><span class="${css.user_name}">${userData.user_name}</span>`;
//             userListRef.current.appendChild(userItem);
//           });
//         } else {
//           const sender = messageData.user_name || 'Unknown Sender';

//           const messageContainer = document.getElementById('messageContainer');
//           const newMessageElement = document.createElement('div');
//           newMessageElement.className = css.chat_message;
//           newMessageElement.innerHTML = `<img src="${messageData.avatar}" alt="${sender}'s Avatar" class="${css.chat_avatar}" /><span class="${css.chat_sender}">${sender}:</span> <span class="${css.messageText}">${messageData.message}</span>`;
//           messageContainer.appendChild(newMessageElement);
//           setHasMessages(true);
//         }
//       } catch (error) {
//         console.error('Error parsing JSON:', error);
//       }
//     };

//     const handleSocketError = (error) => {
//       console.error('WebSocket Error:', error);
//     };

//     const handleSocketClose = () => {
//       // Handle socket close if needed
//     };

//     socket.addEventListener('open', handleSocketOpen);
//     socket.addEventListener('message', handleSocketMessage);
//     socket.addEventListener('error', handleSocketError);
//     socket.addEventListener('close', handleSocketClose);

//     return () => {
//       socket.removeEventListener('open', handleSocketOpen);
//       socket.removeEventListener('message', handleSocketMessage);
//       socket.removeEventListener('error', handleSocketError);
//       socket.removeEventListener('close', handleSocketClose);

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
//       <h2 className={css.title}>Topic: {roomName}</h2>
//       <div className={css.main_container}>
//         <div className={css.members_container}>
//           <h3 className={css.members_title}>Chat members</h3>
//           <ul ref={userListRef} className={css.userList}></ul>
//         </div>
//         <div className={css.chat_container}>
//           <div className={css.chat_area} id="messageContainer">
//           {!isDataReady ? (
//             <div className={css.no_messages}>
//               <img src={Bg} alt="No messages" />
//               <p className={css.no_messages_text}>Loading...</p>
//             </div>
//           ) : !hasMessages && (
//             <div className={css.no_messages}>
//               <img src={Bg} alt="No messages" />
//               <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
//             </div>
//           )}
//           </div>
//           <div className={css.input_container}>
//             <input
//               type="text"
//               value={message}
//               onChange={handleMessageChange}
//               placeholder="Write message"
//             />
//             <button onClick={sendMessage} className={css.button_send}>
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
