// -----------------------------------------------27.11.2023

import React, { useState, useEffect, useMemo, useRef  } from 'react';
import { useParams } from 'react-router-dom';
import css from './Chat.module.css';
import Bg from '../Images/Bg_empty_chat.png';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const { roomName } = useParams();
  const token = localStorage.getItem('access_token');
  const userListRef = useRef(null);

  const socket = useMemo(() => new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`), [roomName, token]);

  useEffect(() => {
    socket.onopen = () => {
      console.log('Connected to the server via WebSocket');
    };


    // socket.onmessage = (event) => {
    //   try {
    //     const messageData = JSON.parse(event.data);
    //     console.log('Received message:', messageData);
    
    //     if (messageData.type === 'active_users') {
    //       const userListItems = userListRef.current.getElementsByTagName('li');
    //       Array.from(userListItems).forEach(item => {
    //         userListRef.current.removeChild(item);
    //       });
    
    //       messageData.data.forEach(userData => {
    //         const userItem = document.createElement('li');
    //         userItem.classList.add(`${css.userItem}`);
    //         userItem.innerHTML = `<img src="${userData.avatar}" alt="${userData.user_name}'s Avatar" class="${css.user_avatar}" /><span class="${css.user_name}">${userData.user_name}</span>`;
    //         userListRef.current.appendChild(userItem);
    //       });
    //     } else {
    //       const sender = messageData.user_name || 'Unknown Sender';
    
    //       const messageContainer = document.getElementById('messageContainer');
    //       const newMessageElement = document.createElement('div');
    //       newMessageElement.className = css.chat_message;
    //       newMessageElement.innerHTML = `<img src="${messageData.avatar}" alt="${sender}'s Avatar" class="${css.chat_avatar}" /><div class="${css.chat_div}"><span class="${css.chat_sender}">${sender}</span> <span class="${css.messageText}">${messageData.message}</span></div>`;
    //       messageContainer.appendChild(newMessageElement);
    //       setHasMessages(true);
    //     }
    //   } catch (error) {
    //     console.error('Error parsing JSON:', error);
    //   }
    // };

    // ...
      socket.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          console.log('Received message:', messageData);

          if (messageData.type === 'active_users') {
            // ... (existing code for updating user list)
          } else {
            const sender = messageData.user_name || 'Unknown Sender';

            const messageContainer = document.getElementById('messageContainer');

            // Check if the current message is from the same user as the previous one
            const previousMessage = messageContainer.lastChild;
            const isSameUser = previousMessage && previousMessage.dataset.sender === sender;

            // If it's the same user, append the message to the existing container
            if (isSameUser) {
              const messageText = document.createElement('span');
              messageText.classList.add(css.messageText);
              messageText.textContent = messageData.message;
              previousMessage.querySelector(`.${css.chat_div}`).appendChild(messageText);
            } else {
              // If it's a different user, create a new container
              const newMessageElement = document.createElement('div');
              newMessageElement.className = css.chat_message;
              newMessageElement.dataset.sender = sender; // Store sender information
              newMessageElement.innerHTML = `<img src="${messageData.avatar}" alt="${sender}'s Avatar" class="${css.chat_avatar}" /><div class="${css.chat_div}"><span class="${css.chat_sender}">${sender}</span> <span class="${css.messageText}">${messageData.message}</span></div>`;
              messageContainer.appendChild(newMessageElement);
            }

            setHasMessages(true);
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
          <ul ref={userListRef} className={css.userList}></ul>
        </div>
        <div className={css.chat_container}>
          <div className={css.chat_area} id="messageContainer">
          {isDataReady && !hasMessages && (
            <div className={css.no_messages}>
              <img src={Bg} alt="No messages" />
              <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
            </div>
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
