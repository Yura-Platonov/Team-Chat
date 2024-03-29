import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import css from './RoomList.module.css';
import CreateRoom from 'components/CreateRoom/CreateRoom';
import { ReactComponent as HeartSVG } from 'components/Images/Heart.svg';
import IconPeopleOnline from 'components/Images/IconPeopleOnline.svg';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  

  const loadRooms = () => {
    axios.get('https://cool-chat.club/api/rooms/')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке списка комнат:', error);
      });
  };

  useEffect(() => {
    loadRooms();
  }, []); 

  const addRoom = (newRoom) => {
    setRooms([...rooms, newRoom]);
  };

  const toggleFavorite = (event, roomId) => {
    event.preventDefault();
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, favorite: !room.favorite } : room
      )
    );
  };

  return (
    <div className={css.room_section}>
      <h2 className={css.room_title}>Choose a room for <br/> communication</h2>
      <ul className={css.room_list}>
        {rooms.map((room) => (
          <li className={css.room_item} key={room.id}>
            <Link to={`/chat/${room.name_room}`}>
              <div className={css.room_container}>
                <img className={css.room_img} src={room.image_room} alt={room.name_room} />
                <p className={css.room_name}>{room.name_room}</p>
              </div>
             
              <div className={css.room_description}>
                
                <HeartSVG
                  className={room.favorite ? css.favoriteHeart : css.heart}
                  onClick={(event) => {
                    event.preventDefault();
                    toggleFavorite(event, room.id);
                }}
                />
              
                <ul className={css.countList}>
                  <li className={css.people_count}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20" className={css.unreadMsgSvg} fill={"#F5FBFF"} >
                      <rect width="28" height="20" rx="4" fill="current"/>
                      <path d="M4.00391 3.88227L11.5507 9.74214C12.9942 10.8629 15.0137 10.8629 16.4571 9.74214L24.0039 3.88227" stroke="#024A7A" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p className={css.whiteText}>{room.count_messages}</p>
                  </li>
                  <li className={css.people_count}>
                    <img src={IconPeopleOnline} alt="IconPeopleOnline" />
                    <p className={css.whiteText}>{room.count_users}</p>
                  </li>
                </ul>
              </div>
              </Link>
          </li>
        ))}
        <li className={css.room_item}>
          <CreateRoom onRoomCreated={addRoom} />
        </li>
      </ul>
    </div>
  );  
}

export default RoomList;