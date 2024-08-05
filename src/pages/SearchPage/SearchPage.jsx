import React, {useState, useEffect } from 'react';
import css from './SearchPage.module.css';
import { useNavigate,useLocation } from 'react-router-dom';
import { ReactComponent as MessagesHeaderSVG } from '../../components/Images/MessagesHeader.svg';



const SearchPage = () => {
  const [searchResults, setSearchResults] = useState({ users: [], rooms: [] });
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  const [currentSocket, setCurrentSocket] = useState(null);
  const [ setIsDropdownVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


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

  const handleUserClick = (user) => {
    if (!token) {
      openLoginModal();
      return;
    }
    console.log(user);
  
    const partnerId = user;
    localStorage.setItem('currentPartnerId', partnerId);
  
    if (currentSocket) {
      currentSocket.close();
    }
  
    const newSocket = new WebSocket(`wss://sayorama.eu/private/${partnerId}?token=${token}`);
    
    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
      navigate(`/Personalchat/${user.user_name}`);
      window.location.reload(); 
      setIsDropdownVisible(false);
    };
  
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  
    setCurrentSocket(newSocket); 
  };
  
  
  const handleChatClick = (roomId) => {
    if (!token) {
      openLoginModal();
      return;
    }
    navigate(`/chat/${roomId}`);
    window.location.reload(); 
    setIsDropdownVisible(false);
  };


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
