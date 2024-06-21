import React, { useState } from 'react';
import CustomModal from './CustomModal';
import axios from 'axios';
import css from './CreateTabModal.module.css';

const ChangeIconTabModal = ({
  isOpen,
  onClose,
  authToken,
  currentTabId,
  tabsIcons,
  setTabs,
  selectedTab,
}) => {
  const [selectedIcon, setSelectedIcon] = useState('');

  const handleChangeIcon = async () => {
    try {
      const requestData = {
        name_tab: selectedTab, // Используем текущее имя табы
        image_tab: selectedIcon, // Новая выбранная иконка
      };

      const response = await axios.put(
        `https://cool-chat.club/api/tabs/?id=${currentTabId}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('Tab icon updated:', response.data);
      onClose(); 
      setTabs(prevTabs => prevTabs.map(tab =>
        tab.id === currentTabId ? { ...tab, image_tab: selectedIcon } : tab
      ));
    } catch (error) {
      console.error('Error updating tab icon:', error);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
      <div className={css.createRoomContainer}>
        <h2 className={css.title}>Choose the icon</h2>
        <div className={css.iconContainer}>
          {Object.keys(tabsIcons).map((iconName) => {
            const IconComponent = tabsIcons[iconName];
            return (
              <div
                key={iconName}
                className={`${css.iconWrapper} ${selectedIcon === iconName ? css.selected : ''}`}
                onClick={() => setSelectedIcon(iconName)}
              >
                <IconComponent />
              </div>
            );
          })}
        </div>
        <div className={css.center}>
          <button className={css.button} onClick={handleChangeIcon}>
            Approve
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ChangeIconTabModal;
