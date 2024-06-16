import React, { useState, useEffect, useCallback } from 'react';
import CreateTabModal from 'components/Modal/CreateTabModal';
import css from './Tabs.module.css';
import axios from 'axios';
import { useAuth } from '../LoginForm/AuthContext';
import tabsIcons from './TabsIcons';
import RoomList from '../RoomList/RoomList';
import { Web as WebIcon } from '@mui/icons-material';

const Tabs = () => {
  const [tabs, setTabs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Web');
  const { authToken } = useAuth();
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);

  useEffect(() => {
    if (authToken) {
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
      fetchTabs();
    }
  }, [authToken]);

  const fetchRooms = useCallback((name_tab) => {
    if (!authToken) {
      console.error('No auth token available');
      return; 
    }
    axios.get(`https://cool-chat.club/api/tabs/${name_tab}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      setRooms(response.data || []);
      setSelectedTab(name_tab);
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching rooms:', error);
    });
  }, [authToken]);

  const loadRooms = () => {
        axios.get('https://cool-chat.club/api/rooms/')
          .then((response) => {
            setRooms(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error('Ошибка при загрузке списка комнат:', error);
          });
      };

  useEffect(() => {
        loadRooms();
      }, []); 

  const openCreateTabModal = () => {
    setIsCreateTabModalOpen(true);
  };

  const closeCreateTabModal = (e) => {
    e?.stopPropagation();
    setIsCreateTabModalOpen(false);
  };

  useEffect(() => {
    const defaultTab = tabs.find(tab => tab.image_tab === 'Web');
    if (defaultTab) {
      fetchRooms(defaultTab.name_tab);
    }
  }, [fetchRooms, tabs]);

  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
    if (tabName === 'Web') {
      return;
    }
    fetchRooms(tabName);
  };

  const handleRoomCreated = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  return (
    <div className={css.tabsContainer}>
      <div className={css.tabsContainerTitle}>
        <h2>{selectedTab}</h2>
        <ul className={css.list_tabs}>
          {tabs.map((tab) => {
            const IconComponent = tabsIcons[tab.image_tab];
            return (
              <li 
                key={tab.id} 
                className={`${css.item_tabs} ${selectedTab === tab.name_tab ? css.selected : ''}`}
                onClick={() => handleSelectTab(tab.name_tab)}
              >
                {IconComponent ? <IconComponent className={css.tab_icon} /> : tab.name_tab}
              </li>
            );
          })}
          <li 
            className={`${css.item_tabs} ${selectedTab === 'Web' ? css.selected : ''}`}
            onClick={() => handleSelectTab('Web')}
          >
            <WebIcon className={css.tab_icon} />
          </li>
        </ul>
      </div>
      <button onClick={openCreateTabModal}>Create Tab</button>
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
      {selectedTab === 'Web' && <RoomList rooms={rooms} onRoomCreated={handleRoomCreated} />}
      {selectedTab !== 'Web' && (
        // <div className={css.rooms_container}>
        //   <h2>
        //     <span className={css.tab_icon}>
        //       {tabsIcons[selectedTab]?.className && <i className={tabsIcons[selectedTab].className} />}
        //     </span>
        //     Rooms in {selectedTab}
        //   </h2>
        //   <ul>
        //     {rooms.length === 0 ? (
        //       <li>Нет комнат</li>
        //     ) : (
        //       rooms.map((room) => (
        //         <li key={room.id} className={css.room_item}>
        //           {room.name}
        //         </li>
        //       ))
        //     )}
        //   </ul>
        // </div>
        <RoomList rooms={rooms} onRoomCreated={handleRoomCreated} />
      )}
    </div>
  );
};

export default Tabs;
