import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';

import css from './PersonalChat.module.css';

const PersonalChat = () => {
  const [message, setMessage] = useState('');
  const [hasMessages, setHasMessages] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [partnerId, setPartnerId] = useState(null);

  const messageContainerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const recipientId = localStorage.getItem('currentPartnerId');
    setPartnerId(recipientId);
  }, []);

  const isWebSocketSupported = 'WebSocket' in window;

  const socket = useMemo(() => {
    if (isWebSocketSupported && partnerId) {
      return new WebSocket(`wss://cool-chat.club/private/${partnerId}?token=${localStorage.getItem('access_token')}`);
    }
    return null;
  }, [partnerId, isWebSocketSupported]);

  useEffect(() => {
    if (partnerId) {
      socket.onopen = () => {
        console.log('Connected to the server via WebSocket');
      };

      socket.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          console.log('Received message:', messageData);

          const { user_name: sender = 'Unknown Sender', created_at, avatar, messages } = messageData;

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

          if (messageContainerRef.current) {
            messageContainerRef.current.appendChild(newMessageElement);
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      socketRef.current = socket;

      return () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    }
  }, [partnerId, socket]);

  useEffect(() => {
    setIsDataReady(true);
  }, []);

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
    if (!socketRef.current) {
      console.error('WebSocket is not initialized.');
    } else if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open.');
    } else if (!message.trim()) {
      console.error('Message is empty.');
    } else {
      const messageObject = {
        message: message,
      };
  
      const messageString = JSON.stringify(messageObject);
      socketRef.current.send(messageString);
  
      setMessage('');
    }
  };

  useEffect(() => {
    const fetchPrivateMessages = async () => {
      try {
        if (partnerId) {
          console.log('Fetching private messages for partnerId:', partnerId);
          const response = await axios.get(`https://cool-chat.club/direct/${partnerId}`);
          const data = response.data;
          console.log('Received private messages data:', data);
          // Add logic to handle received data if necessary
        }
      } catch (error) {
        console.error('Error fetching private messages:', error);
      } finally {
        console.log(123);
      }
    };

    if (partnerId !== null) {
      fetchPrivateMessages();
    }
  }, [socketRef, partnerId]);

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
