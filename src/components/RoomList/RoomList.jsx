import React from 'react';
import { useNavigate } from 'react-router-dom';
import css from './RoomList.module.css';
import CreateRoom from '../CreateRoom/CreateRoom';
import IconPeopleOnline from '../Images/IconPeopleOnline.svg';

function RoomList({ rooms, onRoomCreated, selectedRooms, setSelectedRooms, isMoveTabOpen, isMoveTabOpenDelete}) {
  const navigate = useNavigate();

  const addRoom = (newRoom) => {
    onRoomCreated(newRoom);
  };

  const handleRoomSelection = (roomId) => {
    setSelectedRooms((prevSelectedRooms) => {
      if (prevSelectedRooms.includes(roomId)) {
        return prevSelectedRooms.filter((id) => id !== roomId);
      } else {
        return [...prevSelectedRooms, roomId];
      }
    });
    console.log('Clicked room ID:', roomId);
  };

  const handleItemClick = (roomId, e) => {
    if (isMoveTabOpen || isMoveTabOpenDelete) {
      e.preventDefault();
      handleRoomSelection(roomId);
    } else {
      navigate(`/chat/${roomId}`);
    }
  };

  return (
    <div className={css.room_section}>
      <ul className={css.room_list}>
        {rooms.map((room) => (
          <li 
          className={`${css.room_item} ${selectedRooms.includes(room.id) ? (isMoveTabOpen ? css.room_item_active : '') : ''} ${selectedRooms.includes(room.id) ? (isMoveTabOpenDelete ? css.room_item_delete : '') : ''}`}
          key={room.id} 
            onClick={(e) => handleItemClick(room.id, e)} 
          >
            {isMoveTabOpen  && (
              <input
                type="checkbox"
                checked={selectedRooms.includes(room.id)}
                onChange={() => handleRoomSelection(room.id)}
                className={css.checkbox}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className={css.room_container}>
              <img className={css.room_img} src={room.image_room} alt={room.name_room} />
              <p className={css.room_name}>{room.name_room}</p>
            </div>
            <div className={`${css.room_description} ${selectedRooms.includes(room.id) ? (isMoveTabOpen ? css.room_description_move : '') : ''} ${selectedRooms.includes(room.id) ? (isMoveTabOpenDelete ? css.room_description_delete : '') : ''}`}>
              <ul className={css.countList}>
                <li className={css.people_count}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" className={css.unreadMsgSvg} fill={"#F5FBFF"}>
                    <rect width="28" height="20" rx="4" fill="current"/>
                    <path d="M4.00391 3.88227L11.5507 9.74214C12.9942 10.8629 15.0137 10.8629 16.4571 9.74214L24.0039 3.88227" stroke="#024A7A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p className={css.whiteText}>{room.count_messages}</p>
                </li>
                <li className={css.people_count}>
                  <img src={IconPeopleOnline} className={css.iconPeopleOnlineSvg} alt="IconPeopleOnline" />
                  <p className={css.whiteText}>{room.count_users}</p>
                </li>
              </ul>
            </div>
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
