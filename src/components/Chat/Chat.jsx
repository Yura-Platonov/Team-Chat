// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import css from './Chat.module.css';
// import axios from 'axios';
// import LoginModal from '../Modal/LoginModal';
// import VerificationEmailModal from '../Modal/VerificationEmailModal';
// import useLoginModal from '../Hooks/useLoginModal';
// import { format, isToday, isYesterday } from 'date-fns';
// import Bg from '../Images/Bg_empty_chat.png';
// import { ReactComponent as LikeSVG } from 'components/Images/Like.svg';
// import { ReactComponent as AddFileSVG } from 'components/Images/AddFileSVG.svg';
// import { ReactComponent as ButtonReplyCloseSVG } from 'components/Images/ButtonReplyClose.svg';
// import { ReactComponent as IconReplySVG } from 'components/Images/IconReply.svg';

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [userList, setUserList] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const { roomName } = useParams();
//   const token = localStorage.getItem('access_token');
//   const messageContainerRef = useRef(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const navigate = useNavigate();
//   const [hoveredMessageId, setHoveredMessageId] = useState(null);
//   const [currentUserId] = useState(localStorage.getItem('user_id'));
//   const [selectedImage, setSelectedImage] = useState([]);
//   const [selectedFilesCount, setSelectedFilesCount] = useState(0);
//   const [selectedReplyMessageId, setSelectedReplyMessageId] = useState(null);
//   const [selectedReplyMessageText, setSelectedReplyMessageText] = useState(null);
//   const [selectedReplyMessageSender, setSelectedReplyMessageSender] = useState(null);
//   // const [selectedMessageId, setSelectedMessageId] = useState(null);
//   const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
//   const { isLoginModalOpen, openLoginModal, closeLoginModal, handleRegistrationSuccess, showVerificationModal, setShowVerificationModal } = useLoginModal();

//   let userName = selectedUser ? selectedUser.user_name : '';

//   const handleDirectMessageClick = () => {
//     if (!token) {
//       openLoginModal();
//       return;
//     }

//     let partnerId = selectedUser.receiver_id; 
//     localStorage.setItem('currentPartnerId', partnerId);

//     const socket = new WebSocket(`wss://cool-chat.club/private/${partnerId}?token=${token}`);
//     socket.onopen = () => {
//       console.log('WebSocket connection opened');
//       navigate(`/Personalchat/${userName}`);
//     };
//   };

//   const handleCloseMenu = () => {
//     setSelectedUser(null);
//   };

//   const handleCloseChatMenu = () => {
//     setIsChatMenuOpen(false);
//   };

//   const handleCloseReply = () => {
//     setSelectedReplyMessageId(null);
//   };

//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!token) {
//       axios.get(`https://cool-chat.club/api/messages/${roomName}?limit=50&skip=0`)
//         .then(response => {
//           const formattedMessages = response.data.map(messageData => {
//             const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar,id, id_return, message, fileUrl } = messageData;
//             const formattedDate = formatTime(created_at);

//             return {
//               sender,
//               avatar,
//               message,
//               formattedDate,
//               receiver_id,
//               id, 
//               id_return,
//               fileUrl,
//             };
//           });

//           setMessages(prevMessages => [...prevMessages, ...formattedMessages]);
//         })
//         .catch(error => {
//           console.error('Error fetching messages:', error);
//         });
//     } else {
//       const socket = new WebSocket(`wss://cool-chat.club/ws/${roomName}?token=${token}`);
//       socketRef.current = socket;

//       socket.onopen = () => {
//         console.log('Connected to the server via WebSocket');
//       };

//       socket.onmessage = (event) => {
//         try {
//           const messageData = JSON.parse(event.data);
//           console.log("Received message:", messageData);
          
//           if (messageData.type === 'active_users') {
//             setUserList(messageData.data);
//           } else if (messageData.id) {
//             const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, id, id_return, vote, fileUrl } = messageData;
//             const formattedDate = formatTime(created_at);

//             const newMessage = {
//               sender,
//               avatar,
//               message,
//               id,
//               id_return,
//               vote,
//               formattedDate,
//               receiver_id,
//               fileUrl
//             };

//             setMessages(prevMessages => {
//               const existingMessageIndex = prevMessages.findIndex(msg => msg.id === newMessage.id);

//               if (existingMessageIndex !== -1) {
//                 const updatedMessages = [...prevMessages];
//                 updatedMessages[existingMessageIndex] = newMessage;
//                 return updatedMessages;
//               }

//               return [...prevMessages, newMessage];
//             });
//           }
//         } catch (error) {
//           console.error('Error parsing JSON:', error);
//         }
//       };

//       socket.onerror = (error) => {
//         console.error('WebSocket Error:', error);
//       };

//       return () => {
//         if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//           socketRef.current.close();
//         }
//       };
//     }
//   }, [roomName, token]);

//   useEffect(() => {
//     if (messageContainerRef.current) {
//       messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!token) {
//       openLoginModal();
//       return;
//     }

//     const trimmedMessage = message.trim();
//     // if (!trimmedMessage && !selectedImage) {
//     //   return;
//     // }

//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       let imageUrl = null;

//       if (selectedImage) {
//         imageUrl = await uploadImage();
//         if (!imageUrl) {
//           console.error('Failed to upload image');
//           return;
//         }
//       }

//       const messageObject = {
//         // message: trimmedMessage,
//         send: {
//           original_message_id: selectedReplyMessageId || null,
//           message: trimmedMessage || null, 
//           fileUrl: imageUrl || null,
//         },
//       };

//       console.log(messageObject);

//       // if (imageUrl) {
//       //   messageObject.fileUrl = imageUrl;
//       // }

//       const messageString = JSON.stringify(messageObject);
//       socketRef.current.send(messageString);

//       setMessage('');
//       setSelectedImage(null); 
//       setSelectedFilesCount(0);
//       // selectedReplyMessageId(null);
//     } else {
//       console.error('WebSocket is not open. Message not sent.');
//     }
//   };

//   const handleMessageChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const formatTime = (created) => {
//     if (!created || isNaN(new Date(created))) {
//       return ''; 
//     }
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

//   const handleAvatarClick = (userData) => {
//     setSelectedUser(userData);
//   };
  
//   const handleLikeClick = (id) => {
//     const requestData = {
//       "vote": {
//         message_id: id,
//         dir: 1
//       }
//     };

//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       const messageString = JSON.stringify(requestData);
//       socketRef.current.send(messageString);
//     } else {
//       console.error('WebSocket is not open. Message not sent.');
//     }
//   };

//   // const handleImageChange = (event) => {
//   //   const files = event.target.files;
//   //   setSelectedFilesCount(files.length);
//   //   const file = files[0];
//   //   if (file) {
//   //     setSelectedImage(file);
//   //   }
//   // };

  
//   const MAX_TOTAL_FILE_SIZE_MB = 10;

//   const handleImageChange = (event) => {
//     const files = event.target.files;
//     const imagesArray = Array.from(files);
  
//     const totalFileSize = imagesArray.reduce((total, file) => total + file.size, 0);
//     const totalFileSizeMB = totalFileSize / (1024 * 1024);
  
//     if (totalFileSizeMB > MAX_TOTAL_FILE_SIZE_MB) {
//       alert(`Total file size should not exceed ${MAX_TOTAL_FILE_SIZE_MB}MB`);
//       return;
//     }
  
//     setSelectedImage(imagesArray);
//   };
  

//   const handleImageSend = async () => {
//     try {
//       const formData = new FormData();
//       selectedImage.forEach((image, index) => {
//         formData.append(`file${index}`, image);
//       });
  
//       const response = await axios.post('https://cool-chat.club/api/upload_google/uploadfile/', formData);
  
//       if (response && response.data) {
//         console.log('Images successfully uploaded:', response.data);
//         // Очистите массив выбранных изображений после успешной отправки
//         setSelectedImage([]);
//       } else {
//         console.error('Failed to upload images');
//       }
//     } catch (error) {
//       console.error('Error uploading images:', error);
//     }
//   };
  

//   const handleImageClose = () =>{
//     setSelectedImage([]);
//   }

//   const handleRemoveImage = (index) => {
//     const updatedImages = [...selectedImage];
//     updatedImages.splice(index, 1);
//     setSelectedImage(updatedImages);
//   };
  

//   const uploadImage = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('file', selectedImage);

//       const response = await axios.post('https://cool-chat.club/api/upload_google/uploadfile/', formData);

//       if (response && response.data && response.data.filename && response.data.public_url) {
//         const imageUrl = response.data.public_url;
//         setSelectedImage(null); 

//         return imageUrl; 
//       } else {
//         console.error('Failed to upload image');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       return null;
//     }
//   };

//   const handleMouseEnter = (id) => {
//     setHoveredMessageId(id);
//   };

//   const handleMouseLeave = () => {
//     setHoveredMessageId(null);
//   };
  
//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       handleChatMessageSend();
//     }
//   };

//   const handleSelectReplyMessage = (messageId, messageText, messageSender) => {
//     console.log(messageId, messageText);
//     setSelectedReplyMessageId(messageId);
//     setSelectedReplyMessageText(messageText);
//     setSelectedReplyMessageSender(messageSender);
//   };

//   const handleSendReply = async (replyMessage) => {
//     if (!token) {
//       openLoginModal();
//       return;
//     }

//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       const replyData = {
//         reply: {
//           original_message_id: selectedReplyMessageId,
//           message: replyMessage
//         }
//       };
//       console.log('Preparing to send reply:', replyData);

//       const messageString = JSON.stringify(replyData);
//       socketRef.current.send(messageString);
//       console.log('Reply successfully sent.');
//     } else {
//       console.error('WebSocket is not open. Reply message not sent.');
//     }
//   };


//   const handleChatMessageSend = () => {
//     if (selectedReplyMessageId) {
    
//       handleSendReply(message);
//       setSelectedReplyMessageId(null); 
//       setSelectedReplyMessageText(null); 
//     } else {
//       sendMessage(); 
//     }
//     setMessage('');
//   };

//   useEffect(() => {
//     const handleOutsideClick2 = (event) => {
//       const menuContainer2 = document.getElementById('chat-menu-container');

//       if (menuContainer2 && !menuContainer2.contains(event.target)) {
//         handleCloseChatMenu();
//       }
//     };

//     document.addEventListener('click', handleOutsideClick2);

//     return () => {
//       document.removeEventListener('click', handleOutsideClick2);
//     };
//   }, []);

  
//   return (
//     <div className={css.container}>
//       <h2 className={css.title}>Topic: {roomName}</h2>
//       <div className={css.main_container}>
//         <div className={css.members_container}>
//           <h3 className={css.members_title}>Chat members</h3>
//           <ul className={css.userList}>
//             {userList.map((userData) => (
//               <li key={userData.user_name} className={css.userItem}>
//                 <div className={css.user_avatarBorder}>
//                   <img src={userData.avatar} alt={`${userData.user_name}'s Avatar`} className={css.user_avatar} />
//                 </div>
//                 <span className={css.user_name}>{userData.user_name}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className={css.chat_container}>
//           <div className={css.chat_area} ref={messageContainerRef}>
//             { messages.length === 0 && (
//               <div className={css.no_messages}>
//                 <img src={Bg} alt="No messages" className={css.no_messagesImg} />
//                 <p className={css.no_messages_text}>Oops... There are no messages here yet. Write first!</p>
//               </div>
//             )}
//             {messages.map((msg, index) => (
//               <div key={index} className={`${css.chat_message} ${parseInt(currentUserId) === parseInt(msg.receiver_id) ? css.my_message : ''}`}>
//                  <div className={css.chat} onMouseEnter={() => handleMouseEnter(msg.id)} onMouseLeave={handleMouseLeave}>
//                   <img
//                     src={msg.avatar}
//                     alt={`${msg.sender}'s Avatar`}
//                     className={css.chat_avatar}
//                     onClick={() => handleAvatarClick({ user_name: msg.sender, avatar: msg.avatar, receiver_id: msg.receiver_id })}
//                   />
//                   <div className={css.chat_div}>
//                     <div className={css.chat_nicktime}>
//                       <span className={css.chat_sender}>{msg.sender}</span>
//                       <span className={css.time}>{msg.formattedDate}</span>
//                     </div>
//               {msg.id_return && msg.id_return !== 0 ?(
//                 <div className={`${css.messageText} ${parseInt(currentUserId) === parseInt(msg.receiver_id) ? css.my_message_text : ''}`}>
//                   {messages.map((message, index) => {
//                     if (message.id === msg.id_return) {
//                       return (
//                         <div key={index} onClick={() => setIsChatMenuOpen(msg.id)}>
//                           <p className={css.replyMessageUsername}>{message.sender}</p>
//                           <p className={css.replyMessageText}>{message.message}</p>
//                           <p className={css.messageTextReply}>
//                             {msg.message}
//                           </p>
//                         </div>
//                       );
//                     }
//                     return null; 
//                   })}
//                 </div>
//               ): (
//                 <p className={`${css.messageText} ${parseInt(currentUserId) === parseInt(msg.receiver_id) ? css.my_message_text : ''}`} onClick={() => setIsChatMenuOpen(msg.id)}>
//                   {msg.message}
//                 </p>
//               )}

//                     {msg.fileUrl && ( 
//                       <img src={msg.fileUrl} alt="Uploaded" className={css.imageContainer} />
//                     )}
//                     <div className={css.actions}>
//                     {(msg.vote > 0 || hoveredMessageId === msg.id) && (
//                         <div className={css.likeContainer} onClick={() => handleLikeClick(msg.id)}>
//                           <LikeSVG className={css.like} />
//                           {msg.vote !== 0 && <span>{msg.vote}</span>}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   {isChatMenuOpen === msg.id && (
//                        <div id={`chat-menu-container-${msg.id}`} className={css.chatMenuContainer}>
//                           <button 
//                           className={css.menuReplyButton}  
//                           onClick={() => {
//                             handleSelectReplyMessage(msg.id, msg.message, msg.sender);
//                             handleCloseChatMenu();
//                             }}>
//                           Reply to message
//                           </button>
//                           <button className={css.d} onClick={handleCloseChatMenu}>X</button>
//                         </div>
                    
//                     )}
//                 </div>
//               </div>
//             ))}
//             {selectedUser && (
//               <div className={css.userMenu}>
//                 <p>Write a direct message to {selectedUser.user_name}</p>
//                 <button onClick={handleDirectMessageClick}>Write a direct message</button>
//                 <button onClick={handleCloseMenu}>Close</button>
//               </div>
//             )}

//           {selectedReplyMessageId && (
//                 <div className={css.replyContainer}>
//                   <IconReplySVG/>
//                   <div className={css.replyContainerFlex}>
//                   <p className={css.replyMessageUsername}>Reply to {selectedReplyMessageSender}</p>
//                   <p className={css.chatTextReply}>{selectedReplyMessageText}</p>
//                   </div>
//                   <div className={css.buttons}>
//                     <ButtonReplyCloseSVG onClick={handleCloseReply}/>
//                   </div>
//                 </div>
//             )}

// {selectedImage.length > 0 && (
//   <div>
//     {selectedImage.map((image, index) => (
//       <div key={index} className={css.imageContainer}>
//         <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
//         <button onClick={() => handleRemoveImage(index)}>Remove</button>
//       </div>
//     ))}
//     <button onClick={handleImageSend}>Send Images</button>
//     <button onClick={handleImageClose}>Close</button>
//   </div>
// )}


//             {/* {selectedImage && (
//                     <div>
//                       {selectedImage.map((image, index) => (
//                         <img key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
//                       ))}
//                       <button onClick={handleImageSend}>Send Images</button>
//                       <button onClick={handleImageClose}>Close</button>
//                     </div>
//                   )} */}
//           </div>
//           <div className={css.input_container}>
//             <label htmlFor="message" className={css.input_label}>
//               <input type="text" id="message" value={message} onChange={handleMessageChange} onKeyDown={handleKeyDown} placeholder="Write message" className={css.input_text} />
//               <label className={css.file_input_label}>
//                 <AddFileSVG className={css.add_file_icon} />
//                 {selectedFilesCount > 0 && <span className={css.selected_files_count}>{selectedFilesCount}</span>}
//                 <input type="file" accept="image/*" onChange={handleImageChange} className={css.file_input} />
//               </label>
//             </label>
//             <button className={css.button_send} onClick={handleChatMessageSend}>Send</button>
//           </div>
//         </div>
//       </div>
//       <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess}/>
//       <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
//       </div>
//   );
// };

// export default Chat;

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

const Chat = () => {
  const [message, setMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [messages, setMessages] = useState([]);
  const { roomName } = useParams();
  const token = localStorage.getItem('access_token');
  const messageContainerRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [currentUserId] = useState(localStorage.getItem('user_id'));
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [selectedReplyMessageId, setSelectedReplyMessageId] = useState(null);
  const [selectedReplyMessageText, setSelectedReplyMessageText] = useState(null);
  const [selectedReplyMessageImage, setselectedReplyMessageImage] = useState(null);
  const [selectedReplyMessageSender, setSelectedReplyMessageSender] = useState(null);
  // const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
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

  const handleCloseMenu = () => {
    setSelectedUser(null);
  };

  const handleCloseChatMenu = () => {
    setIsChatMenuOpen(false);
  };

  const handleCloseReply = () => {
    setSelectedReplyMessageId(null);
  };

  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      axios.get(`https://cool-chat.club/api/messages/${roomName}?limit=50&skip=0`)
        .then(response => {
          const formattedMessages = response.data.map(messageData => {
            const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar,id, id_return, message, fileUrl } = messageData;
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
          
          if (messageData.type === 'active_users') {
            setUserList(messageData.data);
          } else if (messageData.id) {
            const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, id, id_return, vote, fileUrl } = messageData;
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
              fileUrl
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

      return () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close();
        }
      };
    }
  }, [roomName, token]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

      setMessage('');
      // setSelectedFilesCount(0);
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
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

      const response = await axios.post('https://cool-chat.club/api/upload_google/uploadfile/', formData);

      if (response && response.data && response.data.filename && response.data.public_url) {
        const imageUrl = response.data.public_url;
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
  
    try {
      const imageUrl = await uploadImage(selectedImage);

      console.log(imageUrl);
  
      if (!imageUrl) {
        console.error('Failed to upload image.');
        return;
      }
  
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const messageObject = {
          send: {
            original_message_id: null,
            message: null, 
            fileUrl: imageUrl,
          },
        };
  
        console.log('Sending message:', messageObject);
  
        const messageString = JSON.stringify(messageObject);
        socketRef.current.send(messageString);
  
        setSelectedImage(null); 
        setSelectedFilesCount(0);
      } else {
        console.error('WebSocket is not open. Message not sent.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
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
  
  // const handleRemoveImage = () => {
  //   setSelectedImage(null);
  // };


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

  // const handleSelectReplyMessage = (messageId, messageText, messageSender) => {
  //   console.log(messageId, messageText);
  //   setSelectedReplyMessageId(messageId);
  //   setSelectedReplyMessageText(messageText);
  //   setSelectedReplyMessageSender(messageSender);
  // };

  const handleSelectReplyMessage = (messageId, messageText, messageSender, imageUrl) => {
    setSelectedReplyMessageId(messageId);
    setSelectedReplyMessageText(messageText);
    setSelectedReplyMessageSender(messageSender);
    setselectedReplyMessageImage(imageUrl); 
  };

  const handleSendReply = async (replyMessage) => {
    if (!token) {
      openLoginModal();
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
    if (selectedReplyMessageId) {
    
      handleSendReply(message);
      setSelectedReplyMessageId(null); 
      setSelectedReplyMessageText(null); 
    } else {
      sendMessage(); 
    }
    setMessage('');
  };

  // useEffect(() => {
  //   const handleOutsideClick2 = (event) => {
  //     const menuContainer2 = document.getElementById('chat-menu-container');

  //     if (menuContainer2 && !menuContainer2.contains(event.target)) {
  //       handleCloseChatMenu();
  //     }
  //   };

  //   document.addEventListener('click', handleOutsideClick2);

  //   return () => {
  //     document.removeEventListener('click', handleOutsideClick2);
  //   };
  // }, []);

  
  return (
    <div className={css.container}>
      <h2 className={css.title}>Topic: {roomName}</h2>
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
              {msg.message && msg.message.trim() !== '' ? (
                    <div className={`${css.messageText} ${parseInt(currentUserId) === parseInt(msg.receiver_id) ? css.my_message_text : ''}`} onClick={() => setIsChatMenuOpen(msg.id)}>
                      {msg.id_return && msg.id_return !== 0 ? (
                        messages.map((message, index) => {
                          if (message.id === msg.id_return) {
                            return (
                              <div key={index} onClick={() => setIsChatMenuOpen(msg.id)}>
                                <p className={css.replyMessageUsername}>{message.sender}</p>
                                {msg.message  ? (
                                    <p className={css.replyMessageText}>{message.message}</p>
                                  ) : (
                                    <img src={message.fileUrl} alt='Reply' className={css.ReplyMessageImage} />
                                  )}
                                
                                  
                                <p className={css.messageTextReply}>{msg.message}</p>
                                {/* <img className={css.ReplyMessageImage} alt='Reply'>{msg.fileUrl}</img> */}
                              </div>
                            );
                          }
                          return null;
                        })
                      ) : (
                        <p>{msg.message}</p>
                      )}
                    </div>
                  ) : msg.fileUrl ? (
                    <img 
                    src={msg.fileUrl} 
                    alt="Uploaded" 
                    className={css.imageContainer}
                    onClick={() => setIsChatMenuOpen(msg.id)}
                    />
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
            <button 
              className={css.menuReplyButton}  
              onClick={() => {
                handleSelectReplyMessage(msg.id, msg.message, msg.sender, msg.fileUrl);
                handleCloseChatMenu();
              }}>
              Reply to message
            </button>
            <button className={css.d} onClick={handleCloseChatMenu}>X</button>
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
                  <p className={css.chatTextReply}>{selectedReplyMessageText}</p>
                  </div>
                  <div className={css.buttons}>
                    <ButtonReplyCloseSVG onClick={handleCloseReply}/>
                  </div>
                </div>
            )} */}
            {selectedReplyMessageId && (
              <div className={css.replyContainer}>
                <IconReplySVG/>
                <div className={css.replyContainerFlex}>
                  <p className={css.replyMessageUsername}>Reply to {selectedReplyMessageSender}</p>
                  {selectedReplyMessageText ? (
                    <p className={css.chatTextReply}>{selectedReplyMessageText}</p>
                  ) : (
                    <img src={selectedReplyMessageImage} alt="Reply" className={css.replyImage} />
                  )}
                </div>
                <div className={css.buttons}>
                  <ButtonReplyCloseSVG onClick={handleCloseReply}/>
                </div>
              </div>
            )}


            {selectedImage && (
              <div className={css.imgContainerUpload}>
                <div className={css.imgUploadDiv}>
                  <img className={css.imgUpload} src={URL.createObjectURL(selectedImage)} alt={`Preview`} />
                  {/* <button onClick={handleRemoveImage}>Remove</button> */}
                </div>
                <button onClick={handleImageSend}>Send Image</button>
                <button onClick={handleImageClose}>Close</button>
              </div>
            )}
          </div>
          <div className={css.input_container}>
            <label htmlFor="message" className={css.input_label}>
              <input type="text" id="message" value={message} onChange={handleMessageChange} onKeyDown={handleKeyDown} placeholder="Write message" className={css.input_text} />
              <label className={css.file_input_label}>
                <AddFileSVG className={css.add_file_icon} />
                {selectedFilesCount > 0 && <span className={css.selected_files_count}>{selectedFilesCount}</span>}
                <input type="file" accept="image/*" onClick={handleImageChange}  className={css.file_input} />
              </label>
            </label>
            <button className={css.button_send} onClick={handleChatMessageSend}>Send</button>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess}/>
      <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      </div>
  );
};

export default Chat;
