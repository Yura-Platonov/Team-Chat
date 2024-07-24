import React, { useEffect, useState } from 'react';

const SocketNotification = () => {
  const [messages, setMessages] = useState([]);
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
      console.log('Message from server: ', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
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
    <div >
      {messages.map((message) => (
        <div>{message}</div>
      ))}
    </div>
  );
};

export default SocketNotification;
