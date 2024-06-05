import React, { useState, useEffect, useCallback  } from 'react';
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
  const [selectedTab, setSelectedTab] =  useState('Web');
  const { authToken } = useAuth();
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);


  useEffect(() => {
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
  }, [authToken]);
  
  // const fetchTabs = () => {
  //   axios.get('https://cool-chat.club/api/tabs/', {
  //     headers: {
  //       Authorization: `Bearer ${authToken}`,
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     }
  //   })
  //   .then((response) => {
  //     setTabs(Object.values(response.data));
  //   }) 
  //   .catch((error) => {
  //     console.error('Error fetching tabs:', error);
  //   });
  // };

  const fetchRooms = useCallback((name_tab) => {
    axios.get(`https://cool-chat.club/api/tabs/${name_tab}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      setRooms(response.data.rooms || []);
      setSelectedTab(name_tab);
    })
    .catch((error) => {
      console.error('Error fetching rooms:', error);
    });
  }, [authToken]);

  // useEffect(() => {
  //   fetchTabs();
  // }, []); 

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

  return (
    <div>
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
      <button onClick={openCreateTabModal}>Create Tab</button>
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
      {selectedTab === 'Web' && <RoomList rooms={rooms} />}
      {selectedTab !== 'Web' && (
        <div className={css.rooms_container}>
          <h2>
            <span className={css.tab_icon}>
              {tabsIcons[selectedTab]?.className && <i className={tabsIcons[selectedTab].className} />}
            </span>
            Rooms in {selectedTab}
          </h2>
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
