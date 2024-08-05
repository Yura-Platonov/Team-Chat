import React, {useState, useEffect } from 'react';
import css from './SearchPage.module.css';
import { useNavigate,useLocation } from 'react-router-dom';
import { ReactComponent as MessagesHeaderSVG } from '../../components/Images/MessagesHeader.svg';



const SearchPage = ({  handleChatClick, handleUserClick }) => {
  const [searchResults, setSearchResults] = useState({ users: [], rooms: [] });
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';

    const fetchResults = async () => {
      const response = await fetch(`${apiBaseUrl}/api/search/${query}`, {
        headers: {
          'accept': 'application/json',
        },
      });
      const data = await response.json();
      setSearchResults(data);
    };

    fetchResults();
  }, [location.search]);


  return (
    <div className={css.searchPageContainer}>  
      {searchResults.users.length > 0 && (
        <div className={css.container}>
        <h3 className={css.resultTitle}>Users</h3>
        <div className={css.resultSection}>
          {searchResults.users.map((user) => (
            <div
              key={user.id}
              className={css.resultItem}
              onClick={() => handleUserClick(user.id)}
            >
              <img src={user.avatar} alt={user.user_name} className={css.resultAvatar} />
              <p className={css.itemName}>{user.user_name}</p>
              <MessagesHeaderSVG  className={css.itemSvg}/>
            </div>
          ))}
        </div>
        </div>
      )}

      <div className={css.searchPageContainer}>  
      {searchResults.rooms.length > 0 && (
        <div className={css.container}>
        <h3 className={css.resultTitle}>Rooms</h3>
        <div className={css.resultSection}>
          {searchResults.rooms.map((room) => (
            <div
              key={room.id}
              className={css.resultItem}
              onClick={() => handleChatClick(room.id)}
            >
              <img src={room.image_room} alt={room.name_room} className={css.resultAvatar} />
              <p className={css.itemName}>{room.name_room}</p>
              <MessagesHeaderSVG  className={css.itemSvg}/>
            </div>
          ))}
        </div>
        </div>
      )}
      </div>

      {(searchResults.users.length === 0 && searchResults.rooms.length === 0) && (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;
