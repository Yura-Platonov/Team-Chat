import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import css from './Chat.module.css';
import axios from 'axios';
import LoginModal from '../Modal/LoginModal';
import VerificationEmailModal from '../Modal/VerificationEmailModal';
import useLoginModal from '../Hooks/useLoginModal';
import { format, isToday, isYesterday } from 'date-fns';
import Bg from '../Images/Bg_empty_chat.png';
import { ReactComponent as LikeSVG } from 'components/Images/Like.svg';
import { ReactComponent as AddFileSVG } from 'components/Images/AddFileSVG.svg';
import { ReactComponent as ButtonReplyCloseSVG } from 'components/Images/ButtonReplyClose.svg';
import { ReactComponent as IconReplySVG } from 'components/Images/IconReply.svg';
import { ReactComponent as SendImgSVG } from 'components/Images/SendImg.svg';
import { ReactComponent as ShowTypingSVG } from 'components/Images/userWrite.svg';
import { ReactComponent as AnimatesTypingSVG } from 'components/Images/animatedWrite.svg';
import ImageModal from 'components/Modal/ImageModal';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const { roomName } = useParams();
  const token = localStorage.getItem('access_token');
  const messageContainerRef = useRef(null);
  const lastLikedMessageIdRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const currentUserId = localStorage.getItem('user_id');
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
  const [isImageSending, setIsImageSending] = useState(false);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [showSVG, setShowSVG] = useState(false);
  // const [ setIsAnimating] = useState(false);
  // const animationTimeoutRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const { isLoginModalOpen, openLoginModal, closeLoginModal, handleRegistrationSuccess, showVerificationModal, setShowVerificationModal } = useLoginModal();

  let userName = selectedUser ? selectedUser.user_name : '';

  const handleDirectMessageClick = () => {
    if (!token) {
      openLoginModal();
      return;
    }

    let partnerId = selectedUser.receiver_id; 
    localStorage.setItem('currentPartnerId', partnerId);

    const socket = new WebSocket(`wss://cool-chat.club/private/${partnerId}?token=${token}`);
    socket.onopen = () => {
      console.log('WebSocket connection opened');
      navigate(`/Personalchat/${userName}`);
    };
  };
  const socketRef = useRef(null);

  // useEffect(() => {
  //   if (!token) {
  //     axios.get(`https://cool-chat.club/api/messages/${roomName}?limit=50&skip=0`)
  //       .then(response => {
  //         const formattedMessages = response.data.map(messageData => {
  //           const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar,id, id_return, message, fileUrl, edited, } = messageData;
  //           const formattedDate = formatTime(created_at);

  //           return {
  //             sender,
  //             avatar,
  //             message,
  //             formattedDate,
  //             receiver_id,
  //             id, 
  //             id_return,
  //             fileUrl,
  //             edited,
  //           };
  //         });

  //         setMessages(prevMessages => [...prevMessages, ...formattedMessages]);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching messages:', error);
  //       });
  //   } else {
  //     const socket = new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`);
  //     socketRef.current = socket;

  //     socket.onopen = () => {
  //       console.log('Connected to the server via WebSocket');
  //     };

      
  //     let isAnimating = false;

  //     socket.onmessage = (event) => {
        
  //       try {
          
  //         const messageData = JSON.parse(event.data);
  //         console.log("Received message:", messageData);
          
  //         if (messageData.type && !isAnimating) {
            
  //           console.log("1234:", messageData.type);
  //           isAnimating = true;

  //           setShowSVG(true);
            
  //           setTimeout(() => {
  //               setShowSVG(false);
  //               isAnimating = false;
  //           }, 3000);
  //         }

  //         if (messageData.type === 'active_users') {
  //           setUserList(messageData.data);
  //         }
  //        else if (messageData.id) {
  //           const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, id, id_return, vote, fileUrl,edited, } = messageData;
  //           const formattedDate = formatTime(created_at);

  //           const newMessage = {
  //             sender,
  //             avatar,
  //             message,
  //             id,
  //             id_return,
  //             vote,
  //             formattedDate,
  //             receiver_id,
  //             fileUrl,
  //             edited,
  //           };

  //           setMessages(prevMessages => {
  //             const existingMessageIndex = prevMessages.findIndex(msg => msg.id === newMessage.id);

  //             if (existingMessageIndex !== -1) {
  //               const updatedMessages = [...prevMessages];
  //               updatedMessages[existingMessageIndex] = newMessage;
  //               return updatedMessages;
  //             }

  //             return [...prevMessages, newMessage];
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Error parsing JSON:', error);
  //       }
  //     };

  //     socket.onerror = (error) => {
  //       console.error('WebSocket Error:', error);
  //     };
 
  //     return () => {
  //       if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
  //         socketRef.current.close();
  //       }
  //     };
  //   }
  // }, [roomName, token]);

  useEffect(() => {
    let isAnimating = false;
    let skipAnimation = true;

    if (!token) {
      axios.get(`https://cool-chat.club/api/messages/${roomName}?limit=50&skip=0`)
        .then(response => {
          const formattedMessages = response.data.map(messageData => {
            const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar,id, id_return, message, fileUrl, edited, } = messageData;
            const formattedDate = formatTime(created_at);

            return {
              sender,
              avatar,
              message,
              formattedDate,
              receiver_id,
              id, 
              id_return,
              fileUrl,
              edited,
            };
          });

          setMessages(prevMessages => [...prevMessages, ...formattedMessages]);
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
          console.log("Received message:", messageData);
          
          if (messageData.type && !skipAnimation && !isAnimating) {            
            console.log("1234:", messageData.type);
            isAnimating = true;
            setShowSVG(true);
            
            setTimeout(() => {
                setShowSVG(false);
                isAnimating = false;
            }, 3000);
          }

          if (messageData.type === 'active_users') {
            setUserList(messageData.data);
          }
         else if (messageData.id) {
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
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
 
      skipAnimation = false;

      return () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close();
        }
      };
    }
  }, [roomName, token]);
  

  // useEffect(() => {
  //   if (messageContainerRef.current) {
  //     messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  //   }
  // }, [messages]);

  // useEffect(() => {
  //   if (shouldScrollToBottom && messageContainerRef.current) {
  //     messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  //   }
  // }, [shouldScrollToBottom, messages]);

  useEffect(() => {
    if (shouldScrollToBottom && messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      const timeoutId = setTimeout(() => {
        setShouldScrollToBottom(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldScrollToBottom, messages]);

  
  const sendMessage = async () => {
    if (!token) {
      openLoginModal();
      return;
    }

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

      // if (imageUrl) {
      //   messageObject.fileUrl = imageUrl;
      // }

      const messageString = JSON.stringify(messageObject);
      socketRef.current.send(messageString);
      setShouldScrollToBottom(true);
      setMessage('');
      // setSelectedFilesCount(0);
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setEditedMessage(e.target.value);
  };

  const formatTime = (created) => {
    if (!created || isNaN(new Date(created))) {
      return ''; 
    }
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
  
  const handleLikeClick = (id) => {

    if (!token) {
      openLoginModal();
      return;
    }

    const requestData = {
      "vote": {
        message_id: id,
        dir: 1
      }
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageString = JSON.stringify(requestData);
      socketRef.current.send(messageString);
      lastLikedMessageIdRef.current = id;
      console.log("Liked message ID:", lastLikedMessageIdRef.current);

      setShouldScrollToBottom(false);

      } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  const handleCloseMenu = () => {
    setSelectedUser(null);
  };

  const handleCloseChatMenu = () => {
    setIsChatMenuOpen(false);
  };

  const handleCloseReply = () => {
    setSelectedReplyMessageId(null);
  };

  const transliterateAndSanitize = (fileName) => {
    const transliterationMap = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ы': 'Y', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya', 'Ї': 'Yi', 'І': 'I', 'Є': 'Ye', 'Ґ': 'G', 'а': 'a',
        'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
        'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ї': 'yi', 'і': 'i', 'є': 'ye', 'ґ': 'g'
    };

    let transliteratedFileName = fileName.split('').map(char => {
        if (transliterationMap[char]) {
            return transliterationMap[char];
        } else if (char === ' ') {
            return '_';
        } else if (/^[a-zA-Z0-9\-_.]$/.test(char)) {
            return char;
        } else {
            return '';
        }
    }).join('');

    return transliteratedFileName;
};

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      const sanitizedFileName = transliterateAndSanitize(selectedImage.name);
      const file = new File([selectedImage], sanitizedFileName, { type: selectedImage.type });
      formData.append('file', file);

      console.log(file);

      // const response = await axios.post('https://cool-chat.club/api/upload_google/uploadfile/', formData);
      // const response = await axios.post('https://cool-chat.club/api/upload/upload-to-supabase/?bucket_name=image_chat', formData);
      const response = await axios.post('https://cool-chat.club/api/upload-to-backblaze/chat?bucket_name=chatall', formData);

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
      if (file.size <= 15 * 1024 * 1024) {
        setSelectedFilesCount(files.length);
        setSelectedImage(file);
      } else {
        alert('Selected file is too large. Please select a file up to 5 MB.');
        setSelectedFilesCount(0);
      }
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

 const handleSelectReplyMessage = (messageId, messageText, messageSender, fileUrl) => {
    setSelectedReplyMessageId(messageId);
    setSelectedReplyMessageText(messageText);
    setSelectedReplyMessageSender(messageSender);
    setselectedReplyMessageImage(fileUrl); 
  };

  const handleSendReply = async (replyMessage) => {
    console.log(replyMessage);

    if (!token) {
      openLoginModal();
      return;
    }

    let fileUrl = null;

    if (selectedImage) {
      fileUrl = await uploadImage(selectedImage);
      console.log(fileUrl);
      if (!fileUrl) {
        console.error('Failed to upload file.');
        return;
      }
    }
    
    if (!replyMessage.trim() && !fileUrl) {
      console.log('Both reply message and file are empty. Not sending reply.');
      return;
  }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const replyData = {
        send: {
          original_message_id: selectedReplyMessageId,
          message: replyMessage,
          fileUrl: fileUrl 
        }
      };
      console.log('Preparing to send reply:', replyData);

      const messageString = JSON.stringify(replyData);
      socketRef.current.send(messageString);
      console.log('Reply successfully sent.');
      setSelectedImage(null);
      setSelectedFilesCount(0);
      setImageText('');
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
    if (!token) {
      openLoginModal();
      return;
    }
  
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
  };

  const handleEditMessageClick = (editedMsg,messageId) => {
    console.log(editedMessage,messageId);
    setEditingMessageId(messageId);
    setEditedMessage(editedMsg);  
  }

  const handleEditMessageSend = () => {
    if (!token) {
      openLoginModal();
      return;
    }

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
  
  const getFileType = (fileUrl) => {
    const extension = getFileExtension(fileUrl).toLowerCase();
    // console.log('File extension:', extension);
  
    if (isImageExtension(extension)) {
      return 'image';
    } else if (isVideoExtension(extension)) {
      return 'video';
    } else if (isDocumentExtension(extension)) {
      return 'document';
    } else {
      return {extension};
    }
  };
  
  const getFileExtension = (fileUrl) => {
    const urlWithoutLastCharacter = fileUrl.endsWith('?') ? fileUrl.slice(0, -1) : fileUrl;
    return urlWithoutLastCharacter.split('.').pop();
  };
  
  const isImageExtension = (extension) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(extension);
  };
  
  const isVideoExtension = (extension) => {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    return videoExtensions.includes(extension);
  };
  
  const isDocumentExtension = (extension) => {
    const documentExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
    return documentExtensions.includes(extension);
  };

  const extractFileNameFromUrl = (fileUrl) => {
    let fileName = fileUrl.split('/').pop();
    if (fileName.endsWith('?')) {
      fileName = fileName.slice(0, -1);
    }
    return fileName.split('?')[0];
  };
  
  const renderFile = (fileUrl) => {
    const fileType = getFileType(fileUrl);
    // console.log(fileType);

  
    switch (fileType) {
      case 'image':
        return <img
        src={fileUrl} 
        alt="Uploaded" 
        className={css.imageInChat}
        onClick={(e) => {
          e.stopPropagation();
          setIsImageModalOpen(true);
          setSelectedImageUrl(fileUrl);
        }}
      />;
      case 'video':
        return <video  
        className={css.imageInChat} 
        onClick={(e) => {
          e.stopPropagation();         
        }} 
        controls><source src={fileUrl} type={`video/${getFileExtension(fileUrl)}`} /></video>;
      case 'document':
        const fileName = extractFileNameFromUrl(fileUrl);
        return (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
           <svg width="36" height="48" className={css.docInChat} viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.75V0H2.25C1.00312 0 0 1.00312 0 2.25V45.75C0 46.9969 1.00312 48 2.25 48H33.75C34.9969 48 36 46.9969 36 45.75V15H23.25C22.0125 15 21 13.9875 21 12.75ZM28.1672 32.565L19.1278 41.5369C18.5044 42.1566 17.4975 42.1566 16.8741 41.5369L7.83469 32.565C6.88313 31.6209 7.55062 30 8.88937 30H15V22.5C15 21.6712 15.6712 21 16.5 21H19.5C20.3288 21 21 21.6712 21 22.5V30H27.1106C28.4494 30 29.1169 31.6209 28.1672 32.565ZM35.3438 9.84375L26.1656 0.65625C25.7438 0.234375 25.1719 0 24.5719 0H24V12H36V11.4281C36 10.8375 35.7656 10.2656 35.3438 9.84375Z"/>
            </svg>
            <p>{fileName}</p>
          </a>
        );
      default:
        // return <p>Unsupported File Type</p>;
        return <p>{fileUrl}</p>;
    }
  };

  
  return (
    <div className={css.container}>
      <h2 className={css.title}>{roomName}</h2>
      <div className={css.main_container}>
        <div className={css.members_container}>
          <h3 className={css.members_title}>Chat members</h3>
          <ul className={css.userList}>
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
            <div className={css.chat} onMouseEnter={() => handleMouseEnter(msg.id)} onMouseLeave={handleMouseLeave}>
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
                  {msg.message || msg.fileUrl ? (
                    <div className={`${css.messageText} ${parseInt(currentUserId) === parseInt(msg.receiver_id) ? css.my_message_text : ''}`} onClick={() => setIsChatMenuOpen(msg.id)}>
                      {msg.id_return && msg.id_return !== 0 ? (
                        messages.find(message => message.id === msg.id_return) ? (
                          messages.map((message, index) => {
                            if (message.id === msg.id_return) {
                              return (
                                <div key={index} onClick={() => setIsChatMenuOpen(msg.id)}>
                                  <p className={css.replyMessageUsername}>{message.sender}</p>
                                  <div className={css.replyContentUp}>
                                  {message.fileUrl && getFileType(message.fileUrl) === 'image' && (
                                      <img src={message.fileUrl} alt='Reply' 
                                      className={css.ReplyMessageImage} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsImageModalOpen(true);
                                        setSelectedImageUrl(message.fileUrl);
                                      }} />
                                    )}
                                    {message.fileUrl && getFileType(message.fileUrl) === 'document' && (
                                      <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                                          <svg width="36" height="48" className={css.docInChat} viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M21 12.75V0H2.25C1.00312 0 0 1.00312 0 2.25V45.75C0 46.9969 1.00312 48 2.25 48H33.75C34.9969 48 36 46.9969 36 45.75V15H23.25C22.0125 15 21 13.9875 21 12.75ZM28.1672 32.565L19.1278 41.5369C18.5044 42.1566 17.4975 42.1566 16.8741 41.5369L7.83469 32.565C6.88313 31.6209 7.55062 30 8.88937 30H15V22.5C15 21.6712 15.6712 21 16.5 21H19.5C20.3288 21 21 21.6712 21 22.5V30H27.1106C28.4494 30 29.1169 31.6209 28.1672 32.565ZM35.3438 9.84375L26.1656 0.65625C25.7438 0.234375 25.1719 0 24.5719 0H24V12H36V11.4281C36 10.8375 35.7656 10.2656 35.3438 9.84375Z"/>
                                          </svg>
                                      </a>
                                    )}
                                    {message.fileUrl && getFileType(message.fileUrl) === 'video' && (
                                      <video  className={css.imageInChat} controls>
                                        <source src={message.fileUrl} type={`video/${getFileExtension(message.fileUrl)}`} />
                                        Your browser does not support the video tag.
                                      </video>
                                    )}
                                    {message.message && <p className={css.replyMessageText}>{message.message}</p>}
                                  </div>
                                  <div className={css.replyContentDown}>
                                  {msg.fileUrl && <img src={msg.fileUrl} alt='Reply' className={css.ReplyMessageImage}
                                  onClick={(e) => {
                                        e.stopPropagation();
                                        setIsImageModalOpen(true);
                                        setSelectedImageUrl(msg.fileUrl);
                                      }}  />}
                                  <p className={css.messageTextReply}>{msg.message}</p>
                                  {msg.edited && <span className={css.editedText}>edited</span>}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })
                        ) : (
                            <div key={index} onClick={() => setIsChatMenuOpen(msg.id)}>
                              <p className={css.replyMessageUsername}>{message.sender}</p>
                              <div className={css.replyContentUp}>
                                {message.fileUrl && <img src={message.fileUrl} alt='Reply' className={css.ReplyMessageImage} />}
                                <p className={css.replyMessageText}>Deleted Message</p>
                              </div>
                              <div className={css.replyContentDown}>
                              {msg.fileUrl && <img src={msg.fileUrl} alt='Reply' className={css.ReplyMessageImage} 
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   setIsImageModalOpen(true);
                              //   setSelectedImageUrl(msg.fileUrl);
                              // }} 
                              />}
                              <p className={css.messageTextReply}>{msg.message}</p>
                              {msg.edited && <span className={css.editedText}>edited</span>}
                            </div>
                            </div>
                        )
                      ) : (
                        <div>
                          {msg.fileUrl && renderFile(msg.fileUrl)}
                          {/* {msg.fileUrl && (
                            <img 
                              src={msg.fileUrl} 
                              alt="Uploaded" 
                              className={css.imageInChat}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsImageModalOpen(true);
                                setSelectedImageUrl(msg.fileUrl);
                              }}
                            />
                          )} */}
                          
                          {msg.message && <p>{msg.message}</p>}
                          {msg.edited && <span className={css.editedText}>edited</span>}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div className={css.actions}>
                    {(msg.vote > 0 || hoveredMessageId === msg.id) && (
                      <div className={css.likeContainer} onClick={() => handleLikeClick(msg.id)}>
                        <LikeSVG className={css.like} />
                        {msg.vote !== 0 && <span>{msg.vote}</span>}
                      </div>
                    )}
                  </div>
                </div>

                {isChatMenuOpen === msg.id && (
                  <div id={`chat-menu-container-${msg.id}`} className={css.chatMenuContainer}>
                    {parseInt(currentUserId) === parseInt(msg.receiver_id) && (
                      <div>
                        <button 
                          className={css.chatMenuMsgButton}  
                          onClick={() => {
                            handleSelectReplyMessage(msg.id, msg.message, msg.sender, msg.fileUrl);
                            handleCloseChatMenu();
                          }}>
                          Reply to message
                        </button>
                        <button className={css.chatMenuMsgButton} 
                           onClick={() => {
                              handleEditMessageClick(msg.message, msg.id);
                              handleCloseChatMenu();
                          }}> 
                          Edit message
                        </button>
                        <button 
                          className={css.chatMenuMsgButton}  
                          onClick={() => {
                            handleDeleteMessage(msg.id);
                            handleCloseChatMenu();
                          }}>
                          Delete Message
                        </button>
                      </div>
                    )}
                    {parseInt(currentUserId) !== parseInt(msg.receiver_id) && (
                      <div>
                        <button 
                          className={css.chatMenuMsgButton}  
                          onClick={() => {
                            handleSelectReplyMessage(msg.id, msg.message, msg.sender, msg.fileUrl);
                            handleCloseChatMenu();
                          }}>
                          Reply to message
                        </button>
                      </div>
                    )}
                    <button className={css.d} onClick={handleCloseChatMenu}>X</button>
                  </div>
                )}
                 {showSVG && (
            <div className={css.svg_container}>
              <AnimatesTypingSVG className={css.wave}/>
              <ShowTypingSVG/>
            </div>
          )}

            </div>
          </div>
        ))}

         
            {selectedUser && (
              <div className={css.userMenu}>
                <p>Write a direct message to {selectedUser.user_name}</p>
                <button onClick={handleDirectMessageClick}>Write a direct message</button>
                <button onClick={handleCloseMenu}>Close</button>
              </div>
            )}
            {/* {selectedReplyMessageId && (
              <div className={css.replyContainer}>
                <IconReplySVG/>
                <div className={css.replyContainerFlex}>
                  <p className={css.replyMessageUsername}>Reply to {selectedReplyMessageSender}</p>
                  <div className={css.replyContainerImgText}>
                  {selectedReplyMessageImage && (
                    <div>
                      <img src={selectedReplyMessageImage} alt="Reply" className={css.replyImage} />
                    </div>
                  )}
                  {selectedReplyMessageText && (
                    <p className={css.chatTextReply}>{selectedReplyMessageText}</p>
                  )}
                  </div>
                </div>
                <div className={css.buttons}>
                  <ButtonReplyCloseSVG onClick={handleCloseReply} className={css.svgCloseReply}/>
                </div>
              </div>
            )} */}
          </div>
          {selectedReplyMessageId && (
              <div className={css.replyContainer}>
                <IconReplySVG/>
                <div className={css.replyContainerFlex}>
                  <p className={css.replyMessageUsername}>Reply to {selectedReplyMessageSender}</p>
                  <div className={css.replyContainerImgText}>
                  {selectedReplyMessageImage && (
                    <div>
                      <img src={selectedReplyMessageImage} alt="Reply" className={css.replyImage} />
                    </div>
                  )}
                  {/* {selectedReplyMessageImage && getFileType(selectedReplyMessageImage) === 'image' && (
                    <img src={selectedReplyMessageImage} alt='Reply' 
                    className={css.ReplyMessageImage} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsImageModalOpen(true);
                      setSelectedImageUrl(selectedReplyMessageImage);
                    }} />
                  )}
                  {selectedReplyMessageImage && getFileType(message.fileUrl) === 'document' && (
                    <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                        <svg width="36" height="48" className={css.docInChat} viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12.75V0H2.25C1.00312 0 0 1.00312 0 2.25V45.75C0 46.9969 1.00312 48 2.25 48H33.75C34.9969 48 36 46.9969 36 45.75V15H23.25C22.0125 15 21 13.9875 21 12.75ZM28.1672 32.565L19.1278 41.5369C18.5044 42.1566 17.4975 42.1566 16.8741 41.5369L7.83469 32.565C6.88313 31.6209 7.55062 30 8.88937 30H15V22.5C15 21.6712 15.6712 21 16.5 21H19.5C20.3288 21 21 21.6712 21 22.5V30H27.1106C28.4494 30 29.1169 31.6209 28.1672 32.565ZM35.3438 9.84375L26.1656 0.65625C25.7438 0.234375 25.1719 0 24.5719 0H24V12H36V11.4281C36 10.8375 35.7656 10.2656 35.3438 9.84375Z"/>
                        </svg>
                    </a>
                  )}
                  {selectedReplyMessageImage && getFileType(message.fileUrl) === 'video' && (
                    <video  className={css.imageInChat} controls>
                      <source src={message.fileUrl} type={`video/${getFileExtension(message.fileUrl)}`} />
                      Your browser does not support the video tag.
                    </video>
                  )} */}
                  {selectedReplyMessageText && (
                    <p className={css.chatTextReply}>{selectedReplyMessageText}</p>
                  )}
                  </div>
                </div>
                <div className={css.buttons}>
                  <ButtonReplyCloseSVG onClick={handleCloseReply} className={css.svgCloseReply}/>
                </div>
              </div>
            )}
          {selectedImage && (
              <div className={css.imgContainerUpload}>
                <div className={css.imgUploadDiv}>
                {isImageExtension(selectedImage.name.toLowerCase().split('.').pop()) ? (

                  <img className={css.imgUpload} src={URL.createObjectURL(selectedImage)} alt={`Preview`}  onClick={() => {
                      setIsImageModalOpen(true);
                      setSelectedImageUrl(URL.createObjectURL(selectedImage));
                    }} />
                  ) : isDocumentExtension(selectedImage.name.toLowerCase().split('.').pop()) ? (
                    <a href={URL.createObjectURL(selectedImage)} target="_blank" rel="noopener noreferrer">
                      <svg width="36" height="48" className={css.docInChat} viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12.75V0H2.25C1.00312 0 0 1.00312 0 2.25V45.75C0 46.9969 1.00312 48 2.25 48H33.75C34.9969 48 36 46.9969 36 45.75V15H23.25C22.0125 15 21 13.9875 21 12.75ZM28.1672 32.565L19.1278 41.5369C18.5044 42.1566 17.4975 42.1566 16.8741 41.5369L7.83469 32.565C6.88313 31.6209 7.55062 30 8.88937 30H15V22.5C15 21.6712 15.6712 21 16.5 21H19.5C20.3288 21 21 21.6712 21 22.5V30H27.1106C28.4494 30 29.1169 31.6209 28.1672 32.565ZM35.3438 9.84375L26.1656 0.65625C25.7438 0.234375 25.1719 0 24.5719 0H24V12H36V11.4281C36 10.8375 35.7656 10.2656 35.3438 9.84375Z"/>
                      </svg>
                    </a>
                  ) : (
                    <video
                      className={css.imgUpload}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      controls
                    >
                      <source src={URL.createObjectURL(selectedImage)} type={`video/${selectedImage.name.split('.').pop()}`} />
                    </video>
                  )}
                </div>
                <div className={css.imageInfo}>
                  <p>{selectedImage.name}</p>
                  <p>{(selectedImage.size / (1024 * 1024)).toFixed(2)} МБ</p>
                  <input
                    className={css.imgInput}
                    type="text"
                    value={imageText}
                    onChange={(e) => setImageText(e.target.value)}
                    placeholder="Write text to img"
                  />
                </div>
                <div className={css.buttons}>
                  <SendImgSVG className={css.sendImg} onClick={handleImageSend}/>
                  <ButtonReplyCloseSVG className={css.svgCloseReply} onClick={handleImageClose}/>
                </div>
              </div>
            )}


          <div className={css.input_container}>
            <label htmlFor="message" className={css.input_label}>
              <input type="text" id="message" value={editingMessageId ? editedMessage : message} onChange={handleMessageChange} onKeyDown={handleKeyDown} placeholder="Write message" className={css.input_text} />
              <div className={css.containerFlex}>
              {editingMessageId && (
              <ButtonReplyCloseSVG className={css.svgCloseEdit} onClick={handleCancelEdit}/>
              )}
              <label className={css.file_input_label}>
                <AddFileSVG className={css.add_file_icon} />
                {selectedFilesCount > 0 && <span className={css.selected_files_count}>{selectedFilesCount}</span>}
                {/* <input type="file" key={selectedFilesCount} accept="image/*" onChange={handleImageChange}  className={css.file_input} /> */}
                <input type="file" key={selectedFilesCount}  onChange={handleImageChange}  className={css.file_input} />
                </label>
              </div>
            </label>
            <div className={css.input_container}>
                {editingMessageId ? (
                  <button className={css.button_send} onClick={handleEditMessageSend}>
                    Edit
                  </button>
                ) : (
                  <button className={css.button_send} onClick={handleChatMessageSend}>
                    Send
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess}/>
      <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      <ImageModal isOpen={isImageModalOpen} imageUrl={selectedImageUrl} onClose={() => setIsImageModalOpen(false)} />
      </div>
  );
};

export default Chat;
