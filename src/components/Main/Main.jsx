import React, { useState }  from 'react';
import Tabs  from 'components/Tabs/Tabs';
import css from './Main.module.css';
import CreateTabModal from 'components/Modal/CreateTabModal';
import { useAuth } from '../LoginForm/AuthContext';




function Main() {
  const [tabs, setTabs] = useState([]);
  const [showPlusItems, setShowPlusItems] = useState(false);
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);

  const { authToken } = useAuth();

  const togglePlusItems = () => {
    setShowPlusItems(!showPlusItems);
  };

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

  const handleCreateTab = (newTab) => {
    setTabs([...tabs, newTab]);
  };


  return (
    <div className={css.container}>
      <section className={css.welcome}>
        <h1 className={css.welcome_title}>Welcome every tourist <br /> to Coolchat</h1>
        <p className={css.welcome_text}>Chat about a wide variety of tourist equipment.<br />Communicate, get good advice and choose!</p>
      </section>
      <Tabs />
      <div className={css.plusButton} onClick={togglePlusItems}>
        {showPlusItems && (
          <>
            <div className={`${css.plusItem} ${css.itemTop}`} >
              Room
            </div>
            <div className={`${css.plusItem} ${css.itemLeft}`}  onClick={openCreateTabModal}>
             Tab
            </div>
            <div className={`${css.plusItem} ${css.itemDiagonal}`}>
              +
            </div>
          </>
        )}
        +
      </div>
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} onCreateTab={handleCreateTab}/>
    </div>
    
  );
}


export default Main;
