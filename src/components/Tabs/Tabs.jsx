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
    console.log(selectedTabData?.id);
    
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

  // const openChangeIconModal = (tab) => {
  //   // setCurrentTabId(tab.id); 
  //   setIsChangeIconModalOpen(true); 
  // };
  
  const closeChangeIconModal = () => {
    setIsChangeIconModalOpen(false);
    setCurrentTabId(null);
  };

  const toggleMenu = () => {
    setIsMenuTabsOpen(!isMenuTabsOpen);
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
      {currentTabIcon && tabsIcons[currentTabIcon] && (
        <img alt='name' />
      )}
    </div>
  </div>
  <RoomList rooms={rooms} onRoomCreated={handleRoomCreated} />
</div>
    </div>
  );
};

export default Tabs;


// import React, { useState, useEffect, useCallback } from 'react';
// import CreateTabModal from 'components/Modal/CreateTabModal';
// import ChangeIconTabModal from 'components/Modal/ChangeIconTabModal'; // Импортируем компонент изменения иконки
// import css from './Tabs.module.css';
// import axios from 'axios';
// import { useAuth } from '../LoginForm/AuthContext';
// import tabsIcons from './TabsIcons';
// import RoomList from '../RoomList/RoomList';
// import { Web as WebIcon } from '@mui/icons-material';
// import { ReactComponent as ToggleMenuTabsSvg } from '../Images/ToggleMenuTabs.svg';

// const Tabs = () => {
//   const [tabs, setTabs] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('Web');
//   const { authToken } = useAuth();
//   const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);
//   const [isMenuTabsOpen, setIsMenuTabsOpen] = useState(false);
//   const [newTabName, setNewTabName] = useState('');
//   const [isChangeIconModalOpen, setIsChangeIconModalOpen] = useState(false); // Состояние для модального окна смены иконки
//   const [currentTabId, setCurrentTabId] = useState(null); // Состояние для текущего id табы
//   const [currentTabIcon, setCurrentTabIcon] = useState(null); // Состояние для текущей иконки табы

//   useEffect(() => {
//     if (authToken) {
//       const fetchTabs = () => {
//         axios.get('https://cool-chat.club/api/tabs/', {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//           },
//         })
//         .then((response) => {
//           setTabs(Object.values(response.data));
//           console.log(Object.values(response.data));
//         })
//         .catch((error) => {
//           console.error('Error fetching tabs:', error);
//         });
//       };
//       fetchTabs();
//     }
//   }, [authToken]);

//   const fetchRooms = useCallback((name_tab) => {
//     if (!authToken) {
//       console.error('No auth token available');
//       return; 
//     }
//     axios.get(`https://cool-chat.club/api/tabs/${name_tab}`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//     })
//     .then((response) => {
//       setRooms(response.data || []);
//       setSelectedTab(name_tab);
//       setNewTabName(name_tab);
//       setCurrentTabIcon(tabsIcons[name_tab]);
//       console.log(response.data);
//     })
//     .catch((error) => {
//       console.error('Error fetching rooms:', error);
//     });
//   }, [authToken, tabsIcons]);

//   const loadRooms = () => {
//     axios.get('https://cool-chat.club/api/rooms/')
//       .then((response) => {
//         setRooms(response.data);
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error('Ошибка при загрузке списка комнат:', error);
//       });
//   };

//   useEffect(() => {
//     loadRooms();
//   }, []);

//   const openCreateTabModal = () => {
//     setIsCreateTabModalOpen(true);
//   };

//   const closeCreateTabModal = (e) => {
//     e?.stopPropagation();
//     setIsCreateTabModalOpen(false);
//   };

//   const openChangeIconModal = (tab) => {
//     setCurrentTabId(tab.id); // Устанавливаем id выбранной табы
//     setIsChangeIconModalOpen(true); // Открываем модальное окно смены иконки
//   };

//   const closeChangeIconModal = () => {
//     setIsChangeIconModalOpen(false);
//     setCurrentTabId(null); // Сбрасываем id табы после закрытия модального окна
//   };

//   useEffect(() => {
//     const defaultTab = tabs.find(tab => tab.image_tab === 'Web');
//     if (defaultTab) {
//       fetchRooms(defaultTab.name_tab);
//     }
//   }, [fetchRooms, tabs]);

//   const handleSelectTab = (tabName) => {
//     setSelectedTab(tabName);
//     if (tabName === 'Web') {
//       loadRooms();
//       return;
//     }
//     fetchRooms(tabName);
//   };

//   const handleRoomCreated = (newRoom) => {
//     setRooms((prevRooms) => [...prevRooms, newRoom]);
//   };

//   const handleCreateTab = (newTab) => {
//     setTabs([...tabs, newTab]);
//   };

//   const handleRenameTab = () => {
//     const selectedTabData = tabs.find(tab => tab.name_tab === selectedTab);
//     if (!selectedTabData || !newTabName) {
//       console.error('No tab selected or new tab name is empty');
//       return;
//     }

//     axios.put(`https://cool-chat.club/api/tabs/?id=${selectedTabData.id}`, {
//       name_tab: newTabName,
//       image_tab: selectedTabData.image_tab,
//     }, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//     })
//     .then((response) => {
//       console.log('Tab renamed:', response.data);
//       setTabs(prevTabs => prevTabs.map(tab => 
//         tab.id === selectedTabData.id ? { ...tab, name_tab: newTabName } : tab
//       ));
//     })
//     .catch((error) => {
//       console.error('Error renaming tab:', error);
//     });
//   };

//   const handleDeleteTab = () => {
//     const selectedTabData = tabs.find(tab => tab.name_tab === selectedTab);
//     if (!selectedTabData) {
//       console.error('No tab selected for deletion');
//       return;
//     }

//     axios.delete(`https://cool-chat.club/api/tabs/?id=${selectedTabData.id}`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//     })
//     .then((response) => {
//       console.log('Tab deleted:', response.data);
//       setTabs(prevTabs => prevTabs.filter(tab => tab.id !== selectedTabData.id));
//       setSelectedTab('Web');
//       setNewTabName('');
//     })
//     .catch((error) => {
//       console.error('Error deleting tab:', error);
//     });
//   };

//   const toggleMenu = () => {
//     setIsMenuTabsOpen(!isMenuTabsOpen);
//   };

//   return (
//     <div className={css.tabsContainer}>
//       <div className={css.tabsContainerTitle}>
//         <div className={css.tabsFlex}>
//           <button className={`${css.menuButton} ${isMenuTabsOpen ? css.menuButtonOpen : ''}`} onClick={toggleMenu}>
//             <ToggleMenuTabsSvg />
//           </button>
//           <h2>{selectedTab}</h2>
//         </div>
//         <ul className={css.list_tabs}>
//           {tabs.map((tab) => {
//             const IconComponent = tabsIcons[tab.image_tab];
//             return (
//               <li 
//                 key={tab.id} 
//                 className={`${css.item_tabs} ${selectedTab === tab.name_tab ? css.selected : ''}`}
//                 onClick={() => handleSelectTab(tab.name_tab)}
//               >
//                 {IconComponent ? <IconComponent className={css.tab_icon} /> : tab.name_tab}
//                 {selectedTab === tab.name_tab && <IconComponent className={css.currentIcon} />} {/* Актуальная иконка */}
//               </li>
//             );
//           })}
//           <li 
//             className={`${css.item_tabs} ${selectedTab === 'Web' ? css.selected : ''}`}
//             onClick={() => handleSelectTab('Web')}
//           >
//             <WebIcon className={css.tab_icon} />
//           </li>
//         </ul>
//       </div>
//       <button onClick={openCreateTabModal}>Create Tab</button>
//       <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} onCreateTab={handleCreateTab}/>
//       <ChangeIconTabModal
//         isOpen={isChangeIconModalOpen}
//         onClose={closeChangeIconModal}
//         authToken={authToken}
//         currentTabId={currentTabId}
//         tabsIcons={tabsIcons}
//         setTabs={setTabs}
//         selectedTab={selectedTab}
//       />
//       <div className={`${css.flex} ${isMenuTabsOpen ? css.roomListShifted : ''}`}>
//         <div className={`${css.menuTabs_container} ${isMenuTabsOpen ? css.menuTabs_containerOpen : ''}`}>
//           <h2>Tab settings</h2>
//           <div>
//             <label>Rename the tab</label>
//             <input 
//               type="text" 
//               value={newTabName} 
//               onChange={(e) => setNewTabName(e.target.value)} 
//               placeholder="Enter new tab name" 
//             />
//             <button onClick={handleRenameTab}>Rename</button>
//           </div>
//           <div>
//             <p>Delete the tab</p>
//             <button onClick={handleDeleteTab}>Delete</button>
//           </div>
         
//             <div>
//               <p>Change the icon</p>
//               <button onClick={() => openChangeIconModal(selectedTab)}>
//                 <currentTabIcon className={css.tab_icon} />
//               </button>
//             </div>
          
//         </div>
//         <RoomList rooms={rooms} onRoomCreated={handleRoomCreated} />
//       </div>
//     </div>
//   );
// };

// export default Tabs;
