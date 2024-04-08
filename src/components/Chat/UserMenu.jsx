// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import css from './UserMenu.module.css';

// const UserMenu = ({ selectedUser, onClose }) => {
//   const navigate = useNavigate();
//   const userName = selectedUser ? selectedUser.user_name : '';

//   const handleDirectMessageClick = () => {
//     console.log(`Direct message to ${selectedUser.user_name}`);
//     const token = localStorage.getItem('access_token');
//     console.log(selectedUser)
//     const partnerId = selectedUser.receiver_id; 

//     const socket = new WebSocket(`wss://cool-chat.club/private/${partnerId}?token=${token}`);
//     socket.onopen = () => {
//       console.log('WebSocket connection opened');
//       navigate(`/Personalchat/${userName}`);
//     };
//   };

//   return (
//     <div className={css.userMenu}>
//       <p>Write a direct message to {userName}</p>
//       <button onClick={handleDirectMessageClick}>Write a direct message</button>
//       <button onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default UserMenu;


