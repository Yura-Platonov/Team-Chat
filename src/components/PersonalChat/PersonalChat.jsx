import React, { useState, useEffect, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { ReactComponent as LikeSVG } from 'components/Images/Like.svg';
import { ReactComponent as AddFileSVG } from 'components/Images/AddFileSVG.svg';
import { ReactComponent as ButtonReplyCloseSVG } from 'components/Images/ButtonReplyClose.svg';
import { ReactComponent as IconReplySVG } from 'components/Images/IconReply.svg';
import { ReactComponent as SendImgSVG } from 'components/Images/SendImg.svg';
import ImageModal from 'components/Modal/ImageModal';
import Bg from '../Images/Bg_empty_chat.png';
import css from '../Chat/Chat.module.css';
import axios from 'axios';

const PersonalChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [userList, setUserList] = useState([]);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [selectedReplyMessageId, setSelectedReplyMessageId] = useState(null);
  const [selectedReplyMessageText, setSelectedReplyMessageText] = useState(null);
  const [selectedReplyMessageImage, setselectedReplyMessageImage] = useState(null);
  const [selectedReplyMessageSender, setSelectedReplyMessageSender] = useState(null);
  const [imageText, setImageText] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');  
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [isImageSending, setIsImageSending] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

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

        const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, id, id_return, vote, fileUrl,edited, } = messageData;
        const formattedDate = formatTime(created_at);

        const newMessage = {
          sender,
          avatar,
          message,
          id,
          id_return,
          vote,
          formattedDate,
          receiver_id,
          fileUrl,
          edited,
        };

        setMessages(prevMessages => {
              const existingMessageIndex = prevMessages.findIndex(msg => msg.id === newMessage.id);

              if (existingMessageIndex !== -1) {
                const updatedMessages = [...prevMessages];
                updatedMessages[existingMessageIndex] = newMessage;
                return updatedMessages;
              }

              return [...prevMessages, newMessage];
            });
          
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

 
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
      const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      console.log('No message to send.');
      console.log(trimmedMessage);
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const messageObject = {
        send: {
          original_message_id: selectedReplyMessageId || null,
          message: trimmedMessage || null, 
          fileUrl:  null,
        },
      };

      console.log(messageObject);
        const messageString = JSON.stringify(messageObject);
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


  const handleCloseChatMenu = () => {
    setIsChatMenuOpen(false);
  };

  const handleCloseReply = () => {
    setSelectedReplyMessageId(null);
  };

  const handleLikeClick = (id) => {
    const requestData = {
      "vote": {
        message_id: id,
        dir: 1
      }
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(requestData);
      socketRef.current.send(messageString);
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      console.log(selectedImage);
      console.log(formData);

      // const response = await axios.post('https://cool-chat.club/api/upload_google/uploadfile/', formData);
      const response = await axios.post('https://cool-chat.club/api/upload/upload-to-supabase/?bucket_name=image_chat', formData);

      if (response && response.data) {
        const imageUrl = response.data;
        // const imageUrl = response.data.public_url;
        setSelectedImage(imageUrl); 
        console.log(imageUrl);
        return imageUrl; 
      } else {
        console.error('Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  
  const handleImageSend = async () => {
    if (!selectedImage) {
      console.error('No image selected.');
      return;
    }
    if (isImageSending) {
      console.log('Image is already being sent.');
      return;
    }

    setIsImageSending(true);
  
    try {
      const imageUrl = await uploadImage(selectedImage);
  
      if (!imageUrl) {
        console.error('Failed to upload image.');
        return;
      }
  
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const messageObject = {
          send: {
            original_message_id: null,
            message: imageText || null,
            fileUrl: imageUrl,
          },
        };
  
        const messageString = JSON.stringify(messageObject);
        socketRef.current.send(messageString);
  
        setSelectedImage(null);
        setSelectedFilesCount(0);
        setImageText('');
      } else {
        console.error('WebSocket is not open. Message not sent.');
      }
    } catch (error) {
      console.error('Error sending image:', error);
    }
   finally {
    setIsImageSending(false);
  }
  };
  
    const handleImageChange = (event) => {
    const files = event.target.files;
    setSelectedFilesCount(files.length);
    const file = files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

    const handleImageClose = () =>{
    setSelectedImage(null);
    setSelectedFilesCount(0);

  };
  

  const handleMouseEnter = (id) => {
    setHoveredMessageId(id);
  };

  const handleMouseLeave = () => {
    setHoveredMessageId(null);
  };
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleChatMessageSend();
    }
  };

 const handleSelectReplyMessage = (messageId, messageText, messageSender, imageUrl) => {
    setSelectedReplyMessageId(messageId);
    setSelectedReplyMessageText(messageText);
    setSelectedReplyMessageSender(messageSender);
    setselectedReplyMessageImage(imageUrl); 
  };

  const handleSendReply = async (replyMessage) => {
      if (!replyMessage.trim() || !selectedReplyMessageImage) {
      console.log('Reply message is empty. Not sending reply.');
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const replyData = {
        reply: {
          original_message_id: selectedReplyMessageId,
          message: replyMessage,
          fileUrl: selectedReplyMessageImage
        }
      };
      console.log('Preparing to send reply:', replyData);

      const messageString = JSON.stringify(replyData);
      socketRef.current.send(messageString);
      console.log('Reply successfully sent.');
    } else {
      console.error('WebSocket is not open. Reply message not sent.');
    }
  };


  const handleChatMessageSend = () => {
    // if (editingMessageId) {
    //   handleEditMessageSend(editedMessage, editingMessageId);
    // }
    if (selectedReplyMessageId) {
      handleSendReply(message);
      setSelectedReplyMessageId(null); 
      setSelectedReplyMessageText(null); 
    }
    
     else {
      sendMessage(); 
    }
    setMessage('');
  };

  const handleDeleteMessage = (messageId) => {
        const deleteMessageObject = {
      delete_message: {
        id: messageId
      }
    };
  
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const deleteMessageString = JSON.stringify(deleteMessageObject);
      socketRef.current.send(deleteMessageString);
    } else {
      console.error('WebSocket is not open. Delete message not sent.');
    }
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      setDeletedMessages(prevDeletedMessages => [...prevDeletedMessages, messageId]);
      console.log(deletedMessages);

  };

  const handleEditMessageClick = (editedMsg,messageId) => {
    console.log(editedMessage,messageId);
    setEditingMessageId(messageId);
    setEditedMessage(editedMsg);  
  }

  const handleEditMessageSend = () => {
    if (!editedMessage.trim()) {
      console.log('Edited message is empty. Not sending edit.');
      return;
    }
  
    const editMessageObject = {
      change_message: {
        id: editingMessageId,
        message: editedMessage
      }
    };

    console.log(editMessageObject);
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const editMessageString = JSON.stringify(editMessageObject);
      socketRef.current.send(editMessageString);
    } else {
      console.error('WebSocket is not open. Edit message not sent.');
      return;
    }
  
    setEditingMessageId(null);
    setEditedMessage('');
    setMessage('');

  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedMessage(''); 
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
