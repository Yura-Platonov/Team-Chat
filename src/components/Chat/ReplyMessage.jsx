import React, { useState } from 'react';
import css from './ReplyMessage.module.css';

const ReplyMessage = ({ message, onCancel, onReply }) => {
  const [reply, setReply] = useState('');

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleSendReply = () => {
    onReply(reply);
    setReply('');
    onCancel();
  };

  return (
    <div className={css.replyMessage}>
      <div className={css.replyInfo}>
        <p>Replying to: {message.sender}</p>
        <p>{message.message}</p>
      </div>
      <textarea
        value={reply}
        onChange={handleReplyChange}
        placeholder="Write your reply here..."
        className={css.replyInput}
      />
      <div className={css.buttons}>
        <button onClick={handleSendReply}>Send</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ReplyMessage;
