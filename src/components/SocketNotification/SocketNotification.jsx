import React, { useEffect } from 'react';
import { useMessages } from './MessageContext';


const SocketNotification = () => {
  const { messages, setMessages } = useMessages();
  const token = localStorage.getItem('access_token');

  const socketUrl = `wss://sayorama.eu/notification?token=${token}`;

  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      socket.send('1');
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      socket.send('1');
      try {
        const data = JSON.parse(event.data); 
        console.log('Message from server: ', data);
        
        if (data.new_message) {
          setMessages(data.new_message); 
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed: ', event);
    };

    const sendNumber = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send('1');
        console.log('Sent number 1 to server');
      }
    };

    const interval = setInterval(sendNumber, 5000);

    return () => {
      clearInterval(interval); 
      socket.close();
    };
  }, [socketUrl]);

  return (
    // <div style={{ display: 'none' }}>
    
    // <div >
    //  {messages.map((message, index) => (
    //     <div key={index}>{message}</div>
    //   ))}
    // </div>
    <div  style={{ display: 'none' }}>
      {messages.map((message, index) => (
        <div key={index}>
          {message.message} 
        </div>
      ))}
    </div>
  );
};

export default SocketNotification;
