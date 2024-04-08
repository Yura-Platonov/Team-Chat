import React from 'react';
import css from './ReplyMessage.module.css';

const ReplyMessage = ({ message, onCancel, onReply }) => {
  return (
    <div className={css.container}>
      <p className={css.message}>{message}</p>
      <div className={css.buttons}>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ReplyMessage;
