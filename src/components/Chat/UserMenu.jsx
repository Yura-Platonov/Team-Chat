// UserMenu.jsx

import React from 'react';
import css from './UserMenu.module.css';

const UserMenu = ({ selectedUser, onClose, posX, posY }) => {
  const handleDirectMessageClick = () => {
    console.log(`Direct message to ${selectedUser.user_name}`);
    // Здесь можешь добавить логику отправки прямого сообщения
    // Например, открыть модальное окно для написания сообщения
  };

  return (
    <div className={css.userMenu} style={{ top: posY, left: posX }}>
      <p>Write direct message to {selectedUser.user_name}</p>
      <button onClick={handleDirectMessageClick}>Write direct message</button>
      {/* Добавим кнопку для закрытия меню */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UserMenu;
