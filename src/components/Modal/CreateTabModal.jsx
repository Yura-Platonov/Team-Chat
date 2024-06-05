import React, { useState } from 'react';
import CustomModal from './CustomModal';
import axios from 'axios';
import css from './CreateTabModal.module.css';
import tabsIcons from 'components/Tabs/TabsIcons';
import { useAuth } from '../LoginForm/AuthContext';


const CreateTabModal = ({
  isOpen,
  onClose,
 
}) => {

  const [selectedIcon, setSelectedIcon] = useState('');
  const [tabName, setTabName] = useState('');
  const { authToken } = useAuth();

   const handleCreateTab = async () => {
    try {
      const requestData = {
        name_tab: tabName,
        image_tab: selectedIcon,
      };

      const response = await axios.post('https://cool-chat.club/api/tabs/', requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Tab created:', response.data);
      onClose();
    } catch (error) {
      console.error('Error creating tab:', error);
    }
  };


  return (
    <CustomModal isOpen={isOpen} onClose={onClose} className={css.modal}>
    <div className={css.createRoomContainer}>
      <h2 className={css.title}>Add a new Tab</h2>
      <label className={css.text}>
        Name of the chat Tab*
        <input
          className={css.input}
          type="text"
          placeholder="Tab Name"
          value={tabName}
          onChange={(e) => setTabName(e.target.value)}
        />
      </label>
      <div>
        <label className={css.text1}>Choose an icon for the Tab*</label>
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
      </div>
      <div className={css.center}>
        <button className={css.button} onClick={handleCreateTab} >
          Approve
        </button>
      </div>
    </div>
  </CustomModal>
);
};

export default CreateTabModal;