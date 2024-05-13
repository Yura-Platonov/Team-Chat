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

        const { user_name: sender = 'Unknown Sender', sender_id, created_at, avatar, messages, id, id_return, vote, fileUrl,edited, } = messageData;
        const formattedDate = formatTime(created_at);

        const newMessage = {
          sender,
          avatar,
          messages,
          id,
          id_return,
          vote,
          formattedDate,
          sender_id,
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

  const handleCloseChatMenu = () => {
    setIsChatMenuOpen(false);
  };
  
  const handleCloseReply = () => {
    setSelectedReplyMessageId(null);
  };

  const sendMessage = async() => {
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
          messages: trimmedMessage || null, 
          fileUrl:  null,
        },
      };

      console.log(messageObject);
      
        const messageString = JSON.stringify(messageObject);
        socketRef.current.send(messageString);

        setMessage('');
      } else {
        console.error('WebSocket is not open. Message not sent.');
      }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

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
            messages: imageText || null,
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
    console.log(replyMessage);
      // if (!replyMessage.trim() || !selectedReplyMessageImage) {
        if (!replyMessage.trim()) {
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
            <div className={css.chat} onMouseEnter={() => handleMouseEnter(msg.id)} onMouseLeave={handleMouseLeave}>
                  <img
                  src={msg.avatar}
                  alt={`${msg.sender}'s Avatar`}
                  className={css.chat_avatar}
                  // onClick={() => handleAvatarClick({ user_name: msg.sender, avatar: msg.avatar, receiver_id: msg.receiver_id })}
                />
                <div className={css.chat_div}>
                  <div className={css.chat_nicktime}>
                    <span className={css.chat_sender}>{msg.sender}</span>
                    <span className={css.time}>{msg.formattedDate}</span>
                  </div>
                  {msg.messages || msg.fileUrl ? (
                      <div className={`${css.messageText} ${parseInt(currentUserId) === parseInt(msg.sender_id) ? css.my_message_text : ''}`} onClick={() => setIsChatMenuOpen(msg.id)}>
                       {msg.id_return && msg.id_return !== 0 ? (
                          messages.map((message, index) => {
                            if (message.id === msg.id_return) {
                              return (
                                <div key={index} onClick={() => setIsChatMenuOpen(msg.id)}>
                                  <p className={css.replyMessageUsername}>{message.sender}</p>
                                  <div className={css.replyContent}>
                                    {message.fileUrl && <img src={message.fileUrl} alt='Reply' className={css.ReplyMessageImage} />}
                                    {message.messages && <p className={css.replyMessageText}>{message.messages}</p>}
                                  </div>
                                  <p className={css.messageTextReply}>{msg.messages}</p>
                                  {msg.edited && <span className={css.editedText}>edited</span>}
                                </div>
                              );
                            }
                            return null;
                          })
                        ) :(
                          <div>
                             {msg.fileUrl && (
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
                            )}
                             {msg.messages && <p>{msg.messages}</p>}
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
                    {parseInt(currentUserId) === parseInt(msg.sender_id) && (
                      <div>
                        <button 
                          className={css.chatMenuMsgButton}  
                          onClick={() => {
                            handleSelectReplyMessage(msg.id, msg.messages, msg.sender, msg.fileUrl);
                            handleCloseChatMenu();
                          }}>
                          Reply to message
                        </button>
                        <button className={css.chatMenuMsgButton} 
                           onClick={() => {
                              handleEditMessageClick(msg.messages, msg.id);
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
                    {parseInt(currentUserId) !== parseInt(msg.sender_id) && (
                      <div>
                        <button 
                          className={css.chatMenuMsgButton}  
                          onClick={() => {
                            handleSelectReplyMessage(msg.id, msg.messages, msg.sender, msg.fileUrl);
                            handleCloseChatMenu();
                          }}>
                          Reply to message
                        </button>
                      </div>
                    )}
                    <button className={css.d} onClick={handleCloseChatMenu}>X</button>
                  </div>
                )}
            </div>
          </div>
        ))}

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
          </div>

          {selectedImage && (
              <div className={css.imgContainerUpload}>
                <div className={css.imgUploadDiv}>
                  <img className={css.imgUpload} src={URL.createObjectURL(selectedImage)} alt={`Preview`}  onClick={() => {
                      setIsImageModalOpen(true);
                      setSelectedImageUrl(URL.createObjectURL(selectedImage));
                    }} />
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
                <input type="file" key={selectedFilesCount} accept="image/*" onChange={handleImageChange}  className={css.file_input} />
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
      <ImageModal isOpen={isImageModalOpen} imageUrl={selectedImageUrl} onClose={() => setIsImageModalOpen(false)} />
    </div>
  );
};

export default PersonalChat;
