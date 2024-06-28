import React, { useState, useEffect, useCallback } from 'react';
import CreateTabModal from 'components/Modal/CreateTabModal';
import ChangeIconTabModal from 'components/Modal/ChangeIconTabModal';
import css from './Tabs.module.css';
import axios from 'axios';
import { useAuth } from '../LoginForm/AuthContext';
import tabsIcons from './TabsIcons'; 
import RoomList from '../RoomList/RoomList';
import { Web as WebIcon } from '@mui/icons-material';
import { ReactComponent as ToggleMenuTabsSvg } from '../Images/ToggleMenuTabs.svg';
import useLoginModal from '../Hooks/useLoginModal';
import LoginModal from '../Modal/LoginModal';
import VerificationEmailModal from '../Modal/VerificationEmailModal';



const Tabs = () => {
  const [tabs, setTabs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Web');
  const { authToken } = useAuth();
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);
  const [isMenuTabsOpen, setIsMenuTabsOpen] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [isChangeIconModalOpen, setIsChangeIconModalOpen] = useState(false);
  const [currentTabId, setCurrentTabId] = useState(null);
  const [currentTabIcon, setCurrentTabIcon] = useState(null);
  const [isWebTabSelected, setIsWebTabSelected] = useState(true); 
  const { isLoginModalOpen, openLoginModal, closeLoginModal, handleRegistrationSuccess, showVerificationModal, setShowVerificationModal } = useLoginModal();
  const [isMoveTabOpen, setIsMoveTabOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]); 
  const [targetTabId, setTargetTabId] = useState(null);

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
          console.log(Object.values(response.data));
        })
        .catch((error) => {
          console.error('Error fetching tabs:', error);
        });
      };
      fetchTabs();
    } else {
      setTabs([]);
      setSelectedTab('Web');
      loadRooms();
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
      setNewTabName(name_tab); 
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
    if (!authToken) {
      openLoginModal();
      return
    }
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
    const selectedTabData = tabs.find(tab => tab.name_tab === tabName);
    setCurrentTabId(selectedTabData?.id);
    setCurrentTabIcon(selectedTabData?.image_tab);
    setIsWebTabSelected(tabName === 'Web');
    if (tabName === 'Web') {
      loadRooms();
      return;
    }
    fetchRooms(tabName);
  };

  const handleRoomCreated = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  const handleCreateTab = (newTab) => {
    setTabs([...tabs, newTab]);
  };

  const handleRenameTab = () => {
    const selectedTabData = tabs.find(tab => tab.name_tab === selectedTab);
    if (!selectedTabData || !newTabName) {
      console.error('No tab selected or new tab name is empty');
      return;
    }

    axios.put(`https://cool-chat.club/api/tabs/?id=${currentTabId}`, {
      name_tab: newTabName,
      image_tab: selectedTabData?.image_tab 
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      console.log('Tab renamed:', response.data);
      setTabs(prevTabs => prevTabs.map(tab => 
        tab.id === selectedTabData.id ? { ...tab, name_tab: newTabName } : tab
      ));
      setSelectedTab(newTabName); 
    })
    .catch((error) => {
      console.error('Error renaming tab:', error);
    });
  };

  const handleDeleteTab = () => {
    const selectedTabData = tabs.find(tab => tab.name_tab === selectedTab);
    if (!selectedTabData) {
      console.error('No tab selected for deletion');
      return;
    }

    axios.delete(`https://cool-chat.club/api/tabs/?id=${selectedTabData.id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      console.log('Tab deleted:', response.data);
      setTabs(prevTabs => prevTabs.filter(tab => tab.id !== selectedTabData.id));
      setSelectedTab('Web');
      setNewTabName('');
    })
    .catch((error) => {
      console.error('Error deleting tab:', error);
    });
  };

  const openChangeIconModal = () => {
    setIsChangeIconModalOpen(true); 
    console.log(selectedTab);
    console.log(currentTabId);
    console.log(currentTabIcon);
  };
  
  const closeChangeIconModal = () => {
    setIsChangeIconModalOpen(false);
    setCurrentTabId(null);
  };

  const toggleMenu = () => {
    setIsMenuTabsOpen(!isMenuTabsOpen);
  };

  const handleTargetTabClick = (tabId) => {
    setTargetTabId(tabId);
    console.log('Clicked tab ID:', tabId);
  };

  const handleMoveRooms = () => {
    if (!targetTabId || selectedRooms.length === 0) {
      console.error('No target tab selected or no rooms selected');
      return;
    }
  
    const data = selectedRooms;
  
    axios.post(`https://cool-chat.club/api/tabs/add-room-to-tab/${targetTabId}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      console.log('Rooms moved:', response.data);
      setSelectedRooms([]);
      setIsMoveTabOpen(false);
      fetchRooms(selectedTab);
    })
    .catch((error) => {
      console.error('Error moving rooms:', error);
    });
  };

  const handleRemoveRoomsFromTab = () => {
    if (!selectedRooms) {
      console.error('No target tab selected or no room ID provided');
      return;
    }

    const data = selectedRooms;
     
    axios.delete(`https://cool-chat.club/api/tabs/delete-room-in-tab/${currentTabId}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      console.log('Room removed from tab:', response.data);
      fetchRooms(selectedTab);
    })
    .catch((error) => {
      console.error('Error removing room from tab:', error);
      console.log(':', error);
    });
  };

  return (
    <div className={css.tabsContainer}>
      <div className={css.tabsContainerTitle}>
        <div className={css.tabsFlex}>
          <button className={`${css.menuButton} ${isMenuTabsOpen ? css.menuButtonOpen : ''}`} onClick={toggleMenu}>
            <ToggleMenuTabsSvg />
          </button>
          <h2>{selectedTab}</h2>
        </div>
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
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} onCreateTab={handleCreateTab}/>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onRegistrationSuccess={handleRegistrationSuccess}/>
      <VerificationEmailModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      <ChangeIconTabModal
        isOpen={isChangeIconModalOpen}
        onClose={closeChangeIconModal}
        authToken={authToken}
        currentTabId={currentTabId}
        tabsIcons={tabsIcons}
        setTabs={setTabs}
        selectedTab={selectedTab}
      />
      <div className={`${css.flex} ${isMenuTabsOpen ? css.roomListShifted : ''}`}>
        <div className={`${css.menuTabs_container} ${isMenuTabsOpen ? css.menuTabs_containerOpen : ''}`}>
          <h2>Tab settings</h2>
          {!isWebTabSelected && (
            <>
              <div>
                <label>Rename the tab</label>
                <input 
                  type="text" 
                  value={newTabName} 
                  onChange={(e) => setNewTabName(e.target.value)} 
                  placeholder="Enter new tab name" 
                />
                <button onClick={handleRenameTab}>Rename</button>
              </div>
              <div>
                <p>Delete the tab</p>
                <button onClick={handleDeleteTab}>Delete</button>
              </div>
              <div>
                <p>Change the icon</p>
                <button onClick={openChangeIconModal}>Change Icon</button>
              </div>
              <div>
                <p>Move rooms to another tab</p>
                <button onClick={() => setIsMoveTabOpen(!isMoveTabOpen)}>Move rooms to ...</button>
                {isMoveTabOpen && (
                  <div>
                   <ul>
                      {tabs.filter(tab => tab.id !== currentTabId).map(tab => (
                        <li 
                          key={tab.id} 
                          onClick={() => handleTargetTabClick(tab.id)}
                          className={targetTabId === tab.id ? css.highlightedTab : ''}
                        >
                          {tab.name_tab}
                        </li>
                      ))}
                    </ul>
                    <button onClick={handleMoveRooms}>Submit</button>
                    <button onClick={() => setIsMoveTabOpen(false)}>Cancel</button>
                  </div>
                )}
              </div>
              <div>
              <p>Delete rooms from this tab</p>
              <button onClick={handleRemoveRoomsFromTab}>Remove rooms</button>
              </div>
            </>
          )}
        </div>
        <RoomList rooms={rooms} onRoomCreated={handleRoomCreated}  selectedRooms={selectedRooms} 
          setSelectedRooms={setSelectedRooms} isMoveTabOpen={isMoveTabOpen}/>
      </div>
    </div>
  );
};

export default Tabs;
