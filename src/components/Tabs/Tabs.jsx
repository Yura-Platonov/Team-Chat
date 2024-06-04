import React, { useState, useEffect, } from 'react';
import CreateTabModal from 'components/Modal/CreateTabModal';
import css from './Tabs.module.css';
import axios from 'axios';
import { useAuth } from '../LoginForm/AuthContext';


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
      <ul>
      
      {tabs.map((tab) => (
      <p className={css.room_name}>{tab.name_tab}</p>))}
      
        <button onClick={openCreateTabModal}>Create Tab</button>
      
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
    </ul>
  );
};

//   return (
//     <div className={css.tabs}>
//       <div className={css.tabHeader}>
//         {Array.isArray(tabs) && tabs.map((tab, index) => (
//           <div
//             key={tab.id}
//             className={`${css.tabTitle} ${index === activeIndex ? css.active : ''}`}
//             onClick={() => handleTabClick(index)}
//           >
//             {tab.name_tab}
//           </div>
//         ))}
//         <button onClick={openCreateTabModal}>Create Tab</button>
//       </div>
//       <div className={css.tabContent}>
//         {Array.isArray(tabs) && tabs.map((tab, index) =>
//           index === activeIndex ? (
//             <Tab key={tab.id} title={tab.name_tab}>
//               <p>Content for {tab.name_tab}</p>
//             </Tab>
//           ) : null
//         )}
//       </div>
//       <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
//     </div>
//   );
// };

const Tab = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export { Tabs, Tab };
