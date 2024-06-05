import React, { useState, useEffect } from 'react';
import CreateTabModal from 'components/Modal/CreateTabModal';
import css from './Tabs.module.css';
import axios from 'axios';
import { useAuth } from '../LoginForm/AuthContext';
import tabsIcons from './TabsIcons';

const Tabs = () => {
  const [tabs, setTabs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const { authToken } = useAuth();
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);

  const fetchTabs = () => {
    axios.get('https://cool-chat.club/api/tabs/', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      setTabs(Object.values(response.data));
    }) 
    .catch((error) => {
      console.error('Error fetching tabs:', error);
    });
  };

  const fetchRooms = (name_tab) => {
    axios.get(`https://cool-chat.club/api/tabs/${name_tab}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      setRooms(response.data.rooms || []);
      // console.log(response.data);
      // console.log(response.data.rooms);
      setSelectedTab(name_tab);
    })
    .catch((error) => {
      console.error('Error fetching rooms:', error);
    });
  };

  useEffect(() => {
    fetchTabs();
  }, []); 

  const openCreateTabModal = () => {
    setIsCreateTabModalOpen(true);
  };

  const closeCreateTabModal = (e) => {
    e?.stopPropagation();
    setIsCreateTabModalOpen(false);
  };

  return (
    <div>
      <ul className={css.list_tabs}>
        {tabs.map((tab) => {
          const IconComponent = tabsIcons[tab.image_tab];
          return (
            <li 
              key={tab.id} 
              className={`${css.item_tabs} ${selectedTab === tab.name_tab ? css.selected : ''}`}
              onClick={() => fetchRooms(tab.name_tab)}
            >
              {IconComponent ? <IconComponent className={css.tab_icon} /> : tab.name_tab}
            </li>
          );
        })}
      </ul>
      <button onClick={openCreateTabModal}>Create Tab</button>
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
      {selectedTab && (
        <div className={css.rooms_container}>
          <h2>Rooms in {selectedTab}</h2>
          <ul>
            {rooms.length === 0 ? (
              <li>Нет комнат</li>
            ) : (
              rooms.map((room) => (
                <li key={room.id} className={css.room_item}>
                  {room.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Tabs;
