import React, { useState, useEffect, useCallback } from 'react';
import css from './Tabs.module.css';
import axios from 'axios';
import { useAuth } from '../LoginForm/AuthContext';
import tabsIcons from './TabsIcons'; 
import RoomList from '../RoomList/RoomList';
import { Web as WebIcon } from '@mui/icons-material';
import { ReactComponent as ToggleMenuTabsSvg } from '../Images/ToggleMenuTabs.svg';
import { ReactComponent as ChangeIconSvg } from '../Images/changeIcon.svg';
import { ReactComponent as DeleteRoomsSvg } from '../Images/deleteRooms.svg';
import { ReactComponent as DeleteTabSvg } from '../Images/deleteTab.svg';
import { ReactComponent as MoveRoomsSvg } from '../Images/moveRooms.svg';
import { ReactComponent as RenameTabSvg } from '../Images/renameTab.svg';
import { ReactComponent as TabCanselButtonSvg } from '../Images/tabCanselButton.svg';
import { ReactComponent as TabConfirmButtonSvg } from '../Images/tabConfirmButton.svg';

import useLoginModal from '../Hooks/useLoginModal';
import LoginModal from 'components/Modal/LoginModal';
import VerificationEmailModal from 'components/Modal/VerificationEmailModal';
import CreateTabModal from 'components/Modal/CreateTabModal';
import ChangeIconTabModal from 'components/Modal/ChangeIconTabModal';
import DeleteRoomFromTabModal from 'components/Modal/DeleteRoomFromTabModal';



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
  const [isMoveTabOpenDelete, setIsMoveTabOpenDelete] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]); 
  const [targetTabId, setTargetTabId] = useState(null);
  const [buttonAction, setButtonAction] = useState(null);
  const [isDeleteRoomModalOpen, setIsDeleteRoomModalOpen] = useState(false);


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

  const fetchRooms = useCallback((name_tab, id) => {
    console.log(name_tab, id)
    if (!authToken) {
      console.error('No auth token available');
      return; 
    }
    if(name_tab === 'Web'){
      return
    }
    axios.get(`https://cool-chat.club/api/tabs/${id}`, {
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
      fetchRooms(defaultTab.name_tab, defaultTab.id);
    }
  }, [fetchRooms, tabs]);

  const handleSelectTab = (tabName, id) => {
    console.log(tabName, id)
    setSelectedTab(tabName);
    const selectedTabData = tabs.find(tab => tab.name_tab === tabName);
    setCurrentTabId(selectedTabData?.id);
    setCurrentTabIcon(selectedTabData?.image_tab);
    setIsWebTabSelected(tabName === 'Web');
    if (tabName === 'Web') {
      loadRooms();
      return;
    }
   else {
    fetchRooms(tabName, id);
  }
    setIsMoveTabOpen(false);
    setIsMoveTabOpenDelete(false);
    setSelectedRooms([]); 
    setButtonAction(null);
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
      setButtonAction(null);
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
      setButtonAction(null);
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
      setButtonAction(null);
      fetchRooms(selectedTab, currentTabId);
    })
    .catch((error) => {
      console.error('Error moving rooms:', error);
    });
  };

    const handleRemoveRoomsFromTab = () => {
    if (!selectedRooms || selectedRooms.length === 0) {
      console.error('No rooms selected for removal');
      return;
    }
  
    const data =  selectedRooms;
  
    console.log(data);
  
    axios.delete(`https://cool-chat.club/api/tabs/delete-room-in-tab/${currentTabId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: data
    })
    .then((response) => {
      console.log('Room removed from tab:', response.data);
      // setSelectedRooms([]);
      // setIsMoveTabOpenDelete(false);
      setButtonAction(null);
      setIsDeleteRoomModalOpen(false);
      fetchRooms(selectedTab, currentTabId);
    })
    .catch((error) => {
      console.error('Error removing room from tab:', error);
    });
  };

  const handleActionButtonClick = (action) => {
    setButtonAction(action);
  };

  const handleConfirmAction = () => {
    switch (buttonAction) {
      case 'rename':
        handleRenameTab();
        break;
      case 'deleteTab':
        handleDeleteTab();
        break;
      case 'move':
        handleMoveRooms();
        break;
      case 'removeRooms':
        setIsDeleteRoomModalOpen(true);
        // handleRemoveRoomsFromTab();
        break;
          
      default:
        console.error('Unknown action:', buttonAction);
    }
  };

  const handleCancelAction = () => {
    setSelectedRooms([]);
    setButtonAction(null);
    setIsMoveTabOpen(false);
    setIsMoveTabOpenDelete(false);
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
                onClick={() => handleSelectTab(tab.name_tab, tab.id)}
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

      <div className={`${css.flex} ${isMenuTabsOpen ? css.roomListShifted : ''}`}>
        <div className={`${css.menuTabs_container} ${isMenuTabsOpen ? css.menuTabs_containerOpen : ''}`}>
          <div className={css.container}>
          <h2 className={css.menu_title}>Tab settings</h2>
          {!isWebTabSelected && (
            <ul className={css.menu_list}>
              <li>
                <label className={css.menu_subtitle}><p className={css.text}>Rename the tab</p> <RenameTabSvg/></label>
                <input 
                  type="text" 
                  className={css.menu_input}
                  value={newTabName} 
                  onChange={(e) => setNewTabName(e.target.value)} 
                  placeholder="Enter new tab name" 
                  onClick={() => handleActionButtonClick('rename')}
                />
              </li>
              <li className={css.menu_subtitle} onClick={() => handleActionButtonClick('deleteTab')}>
                <p className={css.text}>Delete the tab</p>
                <DeleteTabSvg style={{ height: '30px' }}/>
              </li>
              <li className={css.menu_subtitle} onClick={openChangeIconModal}>
                <p className={css.text}>Change the icon</p>
                <ChangeIconSvg/>
              </li>
              <li className={css.menu_subtitle} onClick={() => {handleActionButtonClick('move'); setIsMoveTabOpen(true)}}>
                <p className={css.text}>Move rooms to...</p>
                <MoveRoomsSvg style={{ height: '30px' }}/>
              </li>
              {isMoveTabOpen && (
                   <ul>
                      {tabs.filter(tab => tab.id !== currentTabId).map(tab => (
                        <li 
                          key={tab.id} 
                          onClick={() => handleTargetTabClick(tab.id)}
                          className={`${css.menu_subtitle2} ${targetTabId === tab.id ? css.highlightedTab : ''}`}
                          >
                          {tab.name_tab}
                        </li>
                      ))}
                    </ul>
                )}
              <li className={css.menu_subtitle} onClick={() => {handleActionButtonClick('removeRooms'); setIsMoveTabOpenDelete(true)}}>
                <p className={css.text}>Delete rooms</p>
                <DeleteRoomsSvg style={{ height: '30px' }}/>
              </li>
            </ul>
          )}
          {isWebTabSelected && (
            <ul>
             <li className={css.menu_subtitle} onClick={() => {handleActionButtonClick('move'); setIsMoveTabOpen(true)}}>
                <p className={css.text}>Move rooms to...</p>
                <MoveRoomsSvg/>
              </li>
              {isMoveTabOpen && (
                   <ul>
                      {tabs.filter(tab => tab.id !== currentTabId).map(tab => (
                        <li 
                          key={tab.id} 
                          onClick={() => handleTargetTabClick(tab.id)}
                          className={`${css.menu_subtitle2} ${targetTabId === tab.id ? css.highlightedTab : ''}`}
                          >
                          {tab.name_tab}
                        </li>
                      ))}
                    </ul>
                )}
            </ul>
          )}
            </div>
            {buttonAction && (
              <div className={css.confirmCancelButtons}>
                  <TabConfirmButtonSvg className={css.confirmButton} onClick={handleConfirmAction}/>           
                  <TabCanselButtonSvg className={css.cancelButton}  onClick={handleCancelAction}/>
              </div>
            )}

        </div>
        <RoomList rooms={rooms} onRoomCreated={handleRoomCreated}  selectedRooms={selectedRooms} 
          setSelectedRooms={setSelectedRooms} isMoveTabOpen={isMoveTabOpen} isMoveTabOpenDelete={isMoveTabOpenDelete}/>
      </div>
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
     <DeleteRoomFromTabModal
          isOpen={isDeleteRoomModalOpen}
          onClose={() => {
            setIsDeleteRoomModalOpen(false);
            setSelectedRooms([]);
            setButtonAction(null);
            setIsMoveTabOpenDelete(false); }}
          onConfirmDelete={handleRemoveRoomsFromTab}
        />
     
    </div>
  );
};

export default Tabs;
