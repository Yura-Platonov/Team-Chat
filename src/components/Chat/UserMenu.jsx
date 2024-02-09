import React from 'react';
import css from './UserMenu.module.css';

const UserMenu = ({ selectedUser, onClose}) => {
  const handleDirectMessageClick = () => {
    console.log(`Direct message to ${selectedUser.user_name}`);
  };

  return (
    <div className={css.userMenu} >
      <p>Write direct message to {selectedUser.user_name}</p>
      <button onClick={handleDirectMessageClick}>Write direct message</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UserMenu;
