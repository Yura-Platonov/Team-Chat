import React, { useState, useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';
import css from '../Chat/Chat.module.css';

const PersonalChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  // const [hasMessages, setHasMessages] = useState(false);
  // const [isDataReady, setIsDataReady] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const currentUserId = localStorage.getItem('user_id');

  const token = localStorage.getItem('access_token');
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const recipientId = localStorage.getItem('currentPartnerId');
    setPartnerId(recipientId);
  }, []);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!partnerId) return;

    const socket = new WebSocket(`wss://cool-chat.club/private/${partnerId}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to the server via WebSocket');
    };

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        console.log('Received message:', messageData);

        const { user_name: sender = 'Unknown Sender', created_at, sender_id, avatar, messages } = messageData;
        const formattedDate = formatTime(created_at);

        const newMessage = {
          sender,
          avatar,
          sender_id,
          message: messages,
          formattedDate,
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        // setHasMessages(true);

        if (messageContainerRef.current) {
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
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };

  }, [partnerId, token]);

  // useEffect(() => {
  //   setIsDataReady(true);
  // }, []);

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

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    try {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const messageObject = {
          messages: message,
        };

        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
          return;
        }
    
        const messageString = JSON.stringify(messageObject);
        console.log('Sending message:', messageObject);
        socketRef.current.send(messageString);

        setMessage('');
      } else {
        console.error('WebSocket is not open. Message not sent. Current readyState:', socketRef.current.readyState);
        throw new Error('WebSocket is not open. Message not sent.');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Direct chat: </h2>
      <div className={css.main_container}>
        <div className={css.chat_container}>
          <div className={css.chat_area} ref={messageContainerRef}>
          { messages.length === 0 && (
            <div className={css.no_messages}>
              <img src={Bg} alt="No messages" className={css.no_messagesImg} />
              <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
            </div>
          )}
            {messages.map((msg, index) => (
              <div key={index} className={`${css.chat_message} ${parseInt(currentUserId) === parseInt(msg.sender_id) ? css.my_message : ''}`}>
                <div className={css.chat}>
                  <img
                    src={msg.avatar}
                    alt={`${msg.sender}'s Avatar`}
                    className={css.chat_avatar}
                  />
                  <div className={css.chat_div}>
                    <div className={css.chat_nicktime}>
                      <span className={css.chat_sender}>{msg.sender}</span>
                      <span className={css.time}>{msg.formattedDate}</span>
                    </div>
                    <p className={css.messageText}>{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={css.input_container}>
            <input type="text" value={message} onChange={handleMessageChange} onKeyDown={handleKeyDown} placeholder="Write message" className={css.input_text}/>
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
