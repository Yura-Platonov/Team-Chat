import React, { useState } from 'react';
import CustomModal from './CustomModal';
import axios from 'axios';
import css from './ChangeIconTab.module.css';
import tabsIcons from 'components/Tabs/TabsIcons';
import { useAuth } from '../LoginForm/AuthContext';

const ChangeIconTab = ({
  isOpen,
  onClose,
  currentTabName, // Принимаем текущее имя вкладки
  currentIcon, // Принимаем текущую иконку вкладки
}) => {
  const { authToken } = useAuth();
  const [selectedIcon, setSelectedIcon] = useState(currentIcon); // Состояние для выбранной иконки

  // Функция для изменения выбранной иконки
  const handleIconChange = (iconName) => {
    setSelectedIcon(iconName);
  };

  // Функция для отправки запроса на изменение иконки
  const handleChangeIcon = async () => {
    try {
      const requestData = {
        name_tab: currentTabName, // Текущее имя вкладки
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
                className={`${css.iconWrapper} ${
                  selectedIcon === iconName ? css.selected : ''
                }`}
                onClick={() => handleIconChange(iconName)}
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

export default ChangeIconTab;
