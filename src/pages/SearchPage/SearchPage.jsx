import React from 'react';
import css from './SearchPage.module.css';
import { useNavigate } from 'react-router-dom';

const SearchPage = ({ searchResults, handleChatClick, handleUserClick }) => {
  const navigate = useNavigate();

  return (
    <div className={css.searchPageContainer}>
      <h2>Search Results</h2>
      <ul>Users
        <li></li>
      </ul>

      <ul>Rooms
      <li></li>

      </ul>
      

      {/* {searchResults.users.length > 0 && (
        <div className={css.resultSection}>
          <h3>Users</h3>
          {searchResults.users.map((user) => (
            <div
              key={user.id}
              className={css.resultItem}
              onClick={() => handleUserClick(user.id)}
            >
              <img src={user.avatar} alt={user.user_name} className={css.resultAvatar} />
              <span>{user.user_name}</span>
            </div>
          ))}
        </div>
      )}

      {searchResults.rooms.length > 0 && (
        <div className={css.resultSection}>
          <h3>Rooms</h3>
          {searchResults.rooms.map((room) => (
            <div
              key={room.id}
              className={css.resultItem}
              onClick={() => handleChatClick(room.id)}
            >
              <img src={room.image_room} alt={room.name_room} className={css.resultAvatar} />
              <span>{room.name_room}</span>
            </div>
          ))}
        </div>
      )}

      {(searchResults.users.length === 0 && searchResults.rooms.length === 0) && (
        <p>No results found.</p>
      )} */}
    </div>
  );
};

export default SearchPage;
