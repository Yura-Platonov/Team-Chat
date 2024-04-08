import React from 'react';
import css from './MessageMenu.module.css';

const MessageMenu = ({ handleSelectReplyMessage, messageId, onClose }) => {
  const handleReplyButtonClick = () => {
    handleSelectReplyMessage(messageId);
  };

  return (
    <div className={css.chatMenuContainer}>
      <button onClick={handleReplyButtonClick}>Reply</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default MessageMenu;
