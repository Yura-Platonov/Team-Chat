// import React, { useState } from 'react';
// import css from './Chat.module.css';
// import Bg from '../Images/Bg_empty_chat.png'
// import { io } from "socket.io-client";

// const Chat = () => {
//   // const [chatMembers, setChatMembers] = useState([]);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]); 

//   const token = localStorage.getItem('access_token');
//   // const roomName = 'Holl';

//   const socket = io('wss://cool-chat.club/ws/{roomName}?token={token}');
  
//   // useEffect(() => {
//   //   socket.on('connect', () => {
//   //     console.log('Connected to the server via WebSocket');
//   //   });
  
//   //   socket.on('message', (message) => {
//   //     const newMessage = { text: message, sender: 'User' };
//   //     addMessage(newMessage);
//   //   });
  
//   //   return () => {
//   //     socket.disconnect();
//   //   };
//   // }, [token, roomName]);
  

//   const handleMessageChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const sendMessage = () => {
    
//     socket.emit('sendMessage', message); 
    
//     const newMessage = { text: message, sender: 'You' };
//     addMessage(newMessage);
  
//     setMessage('');
//   };

//   const addMessage = (newMessage) => {
//     setMessages([...messages, newMessage]);
//   };

//   return (
//     <div className={css.container}>
//       <h2 className={css.title}>Topic: Tourist furniture and tableware</h2>
//       <div className={css.main_container}>
//         <div className={css.members_container}>
//           <h3 className={css.members_title}>Chat members</h3>
//           {/* <ul className={css.members_list}>
//             {chatMembers.map((member) => (
//               <li key={member.id} className={css.members_item}>
//                 <img
//                   src={member.avatar}
//                   alt={member.name}
//                   className={css.avatar}
//                 />
//                 {member.name}
//               </li>
//             ))}
//           </ul> */}
//         </div>
//         <div className={css.chat_container}>
//           <div className={css.chat_area}>
//              {messages.length === 0 ? (
//               <div className={css.no_messages}>
//                 <img src={Bg} alt="No messages" />
//                 <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
//               </div>
//             ) : (
//                messages.map((message, index) => (
//                 <div key={index} className={css.message}>
//                   {message.sender}: {message.text}
//                 </div>
//               ))
//             )}
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

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [socket, setSocket] = useState(null);
  const { roomName } = useParams();

  useEffect(() => {
    if (token) {
      // Подключение к серверу сокетов с использованием токена и имени комнаты
      // const newSocket = io(`wss://cool-chat.club?token=${token}&roomName=${roomName}`);
      // const newSocket = io(`wss://cool-chat.club/ws/${roomName}?token=${token}`);
         const newSocket = io(`wss://cool-chat.club/ws?${roomName}?token=${token}`);


      newSocket.on('connect', () => {
        console.log('Connected to the server via WebSocket');
      });

      newSocket.on('message', (message) => {
        // Принимаем сообщение и добавляем его в список сообщений
        addMessage({ text: message, sender: 'User' });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, roomName]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (socket) {
      // Отправляем сообщение на сервер
      socket.emit('sendMessage', message);

      // Добавляем отправленное сообщение в список сообщений
      addMessage({ text: message, sender: 'You' });

      setMessage('');
    }
  };

  const addMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <div>
      <h1>Mini Chat</h1>
      <h2>Chat Room: {roomName}</h2>
      <div>
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              {message.sender}: {message.text}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Write message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
