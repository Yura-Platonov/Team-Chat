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
import ReplyMessage from './ReplyMessage';
import MessageMenu from './MessageMenu';

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
  // const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(null);
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

  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      axios.get(`https://cool-chat.club/api/messages/${roomName}?limit=50&skip=0`)
        .then(response => {
          const formattedMessages = response.data.map(messageData => {
            const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, fileUrl } = messageData;
            const formattedDate = formatTime(created_at);

            return {
              sender,
              avatar,
              message,
              formattedDate,
              receiver_id,
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
            const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, id, vote, fileUrl } = messageData;
            const formattedDate = formatTime(created_at);

            const newMessage = {
              sender,
              avatar,
              message,
              id,
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
    if (!trimmedMessage && !selectedImage) {
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      let imageUrl = null;

      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          console.error('Failed to upload image');
          return;
        }
      }

      const messageObject = {
        message: trimmedMessage,
      };

      if (imageUrl) {
        messageObject.fileUrl = imageUrl;
      }

      const messageString = JSON.stringify(messageObject);
      socketRef.current.send(messageString);

      setMessage('');
      setSelectedImage(null); 
      setSelectedFilesCount(0);
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

  const handleImageChange = (event) => {
    const files = event.target.files;
    setSelectedFilesCount(files.length);
    const file = files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await axios.post('https://cool-chat.club/api/upload_google/uploadfile/', formData);

      if (response && response.data && response.data.filename && response.data.public_url) {
        const imageUrl = response.data.public_url;
        setSelectedImage(null); 

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

  const handleMouseEnter = (id) => {
    setHoveredMessageId(id);
  };

  const handleMouseLeave = () => {
    setHoveredMessageId(null);
  };
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSelectReplyMessage = (messageId, messageText) => {
    setSelectedReplyMessageId(messageId);
    setSelectedReplyMessageText(messageText);
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
          message: replyMessage
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

  // const handleMenuClick = (messageId) => {
  //   setSelectedMessageId(messageId); 
  // };
  
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
                    {msg.message && ( 
                      <p className={css.messageText} onClick={() => setIsChatMenuOpen(msg.id)}>{msg.message}</p>
                    )}
                    {msg.fileUrl && ( 
                      <img src={msg.fileUrl} alt="Uploaded" className={css.imageContainer} />
                    )}
                    <div className={css.actions}>
                    {(msg.vote > 0 || hoveredMessageId === msg.id) && (
                        <div className={css.likeContainer} onClick={() => handleLikeClick(msg.id)}>
                          <LikeSVG className={css.like} />
                          {msg.vote !== 0 && <span>{msg.vote}</span>}
                        </div>
                      )}
                      {/* <button onClick={() => handleSelectReplyMessage(msg.id)}>Reply</button> */}
                    </div>
                  </div>
                  {isChatMenuOpen === msg.id && (
                    <MessageMenu
                    handleSelectReplyMessage={handleSelectReplyMessage}
                    messageId={selectedReplyMessageId}
                    onClose={() => setIsChatMenuOpen(null)}
                    />
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
          {selectedReplyMessageId && (
                <ReplyMessage
                message={selectedReplyMessageText}
                onCancel={() => {
                  setSelectedReplyMessageId(null);
                  setSelectedReplyMessageText(null);
                }}
                onReply={() => {
                  // Обработка отправки реплая
                }}
              />
            )}
          </div>
          <div className={css.input_container}>
            <label htmlFor="message" className={css.input_label}>
              <input type="text" id="message" value={message} onChange={handleMessageChange} onKeyDown={handleKeyDown} placeholder="Write message" className={css.input_text} />
              <label className={css.file_input_label}>
                <AddFileSVG className={css.add_file_icon} />
                {selectedFilesCount > 0 && <span className={css.selected_files_count}>{selectedFilesCount}</span>}
                <input type="file" accept="image/*" onChange={handleImageChange} className={css.file_input} />
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
// import ReplyMessage from './ReplyMessage';

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [userList, setUserList] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const { roomName } = useParams();
//   const token = localStorage.getItem('access_token');
//   const messageContainerRef = useRef(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const navigate = useNavigate();
//   const [currentUserId] = useState(localStorage.getItem('user_id'));
//   const [hoveredMessageId, setHoveredMessageId] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedFilesCount, setSelectedFilesCount] = useState(0);
//   const [selectedReplyMessage, setSelectedReplyMessage] = useState(null);
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

//   const socketRef = useRef(null);

//   useEffect(() => {
//     if (!token) {
//       axios.get(`https://cool-chat.club/api/messages/${roomName}?limit=50&skip=0`)
//         .then(response => {
//           const formattedMessages = response.data.map(messageData => {
//             const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, fileUrl } = messageData;
//             const formattedDate = formatTime(created_at);

//             return {
//               sender,
//               avatar,
//               message,
//               formattedDate,
//               receiver_id,
//               fileUrl,
//             };
//           });

//           setMessages(prevMessages => [...prevMessages, ...formattedMessages]);
//         })
//         .catch(error => {
//           console.error('Error fetching messages:', error);
//         });
//     } else {
//       const socket = new WebSocket(`wss://cool-chat.club/test_chat/${roomName}?token=${token}`);
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
//             const { user_name: sender = 'Unknown Sender', receiver_id, created_at, avatar, message, id, vote, fileUrl } = messageData;
//             const formattedDate = formatTime(created_at);

//             const newMessage = {
//               sender,
//               avatar,
//               message,
//               id,
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
//     if (!trimmedMessage && !selectedImage) {
//       return;
//     }

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
//         send: {
//           original_message_id: selectedReplyMessage,
//           message: trimmedMessage || null, 
//           fileUrl: imageUrl || null,
//         },
//       };

//       console.log('Sending message:', messageObject);
//       const messageString = JSON.stringify(messageObject);
//       socketRef.current.send(messageString);

//       setMessage('');
//       setSelectedImage(null); 
//       setSelectedFilesCount(0);
//       setSelectedReplyMessage(null);
//     } else {
//       console.error('WebSocket is not open. Message not sent.');
//     }
//   };

//   const handleSelectReplyMessage = (messageId) => {
//     setSelectedReplyMessage(messageId);
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

//   const handleImageChange = (event) => {
//     const files = event.target.files;
//     setSelectedFilesCount(files.length);
//     const file = files[0];
//     if (file) {
//       setSelectedImage(file);
//     }
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
//       sendMessage();
//     }
//   };

//   const handleSendReply = async (replyMessage) => {
//     if (!token) {
//       openLoginModal();
//       return;
//     }

//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       const replyData = {
//         reply: {
//           original_message_id: selectedReplyMessage,
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

//   // const handleChatMessageSend = () => {
//   //   if (selectedReplyMessage) {
    
//   //     handleSendReply(message);
//   //     setSelectedReplyMessage(null); 
//   //   } else {
//   //     sendMessage(); 
//   //   }
//   //   setMessage('');
//   // };
  
  

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
//                 <div className={css.chat} onMouseEnter={() => handleMouseEnter(msg.id)} onMouseLeave={handleMouseLeave}>
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
//                     {msg.message && ( 
//                       <p className={css.messageText}>{msg.message}</p>
//                     )}
//                     {msg.fileUrl && ( 
//                       <img src={msg.fileUrl} alt="Uploaded" className={css.imageContainer} />
//                     )}
//                     <div className={css.actions}>
//                       {(msg.vote > 0 || hoveredMessageId === msg.id) && (
//                         <div className={css.likeContainer} onClick={() => handleLikeClick(msg.id)}>
//                           <LikeSVG className={css.like} />
//                           {msg.vote !== 0 && <span>{msg.vote}</span>}
//                         </div>
//                       )}
//                       <button onClick={() => handleSelectReplyMessage(msg.id)}>Reply</button>
//                     </div>
//                   </div>
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
//             {/* <button className={css.button_send} onClick={sendMessage}>Send</button> */}
//             <button className={css.button_send} onClick={sendMessage}>Send</button>

//           </div>
//         </div>
//       </div>
//       <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess}/>
//       <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
//       {selectedReplyMessage && (
//         <ReplyMessage onCancel={() => setSelectedReplyMessage(null)} onReply={handleSendReply} messageId={selectedReplyMessage} />
//       )}
//     </div>
//   );
// };

// export default Chat;
