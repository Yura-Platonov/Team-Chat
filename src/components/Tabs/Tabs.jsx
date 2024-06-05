import React, { useState, useEffect, } from 'react';
import CreateTabModal from 'components/Modal/CreateTabModal';
import css from './Tabs.module.css';
import axios from 'axios';
import { useAuth } from '../LoginForm/AuthContext';
import tabsIcons from './TabsIcons';


const Tabs = () => {
  const [tabs, setTabs] = useState([]);
  const { authToken } = useAuth();
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);

  const fetchTabs = () => {
    axios.get('https://cool-chat.club/api/tabs/', 
    {headers: {
         Authorization: `Bearer ${authToken}`,
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       }
     })
     .then((response) => {
      console.log(response.data);
      setTabs(Object.values(response.data));
   }) 
   .catch ((error) =>  {
     console.error('Error fetching tabs:', error);
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
    <ul className={css.list_tabs}>
    {tabs.map((tab) => {
      const IconComponent = tabsIcons[tab.image_tab];
      return (
        <li key={tab.id} className={css.item_tabs}>
          {IconComponent ? <IconComponent className={css.tab_icon} /> : tab.name_tab}
        </li>
       );
      })}
    <button onClick={openCreateTabModal}>Create Tab</button>
    <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
  </ul>
  );
};

const Tab = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export { Tabs, Tab };
