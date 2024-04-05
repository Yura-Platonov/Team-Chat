import React from 'react';
import css from './ReplyMessage.module.css';

const ReplyMessage = ({ onCancel, onReply, replyMessage }) => {
  const handleSendReply = () => {
    onReply(replyMessage);
  };

  return (
    <div className={css.container}>
      <div className={css.replyInfo}>
        <p className={css.replyText}>Replying to:</p>
        <p className={css.replyMessage}>{replyMessage}</p>
      </div>
      <div className={css.buttons}>
        <button className={css.cancelButton} onClick={onCancel}>Cancel</button>
        <button className={css.replyButton} onClick={handleSendReply}>Reply</button>
      </div>
    </div>
  );
};

export default ReplyMessage;
