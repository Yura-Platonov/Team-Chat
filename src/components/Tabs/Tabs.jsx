import React, { useState } from 'react';
// import axios from 'axios';
import CreateTabModal from 'components/Modal/CreateTabModal';

const Tabs = ({ defaultActiveIndex, children }) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || 0);
  const [isCreateTabModalOpen ,setIsCreateTabModalOpen] = useState(false);

  const openCreateTabModal = () => {
    setIsCreateTabModalOpen(true);
  };
  const closeCreateTabModal = (e) => {
    e.stopPropagation()
    setIsCreateTabModalOpen(false);
  };

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  // const createTab = async () => {
  //   try {
  //     const requestData = {
  //       name_tab: 'example_tab',
  //       image_tab: 'example_image_url'
  //     };

  //     const response = await axios.post('https://cool-chat.club/api/tabs/', requestData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       }
  //     });

  //     console.log('Tab created:', response.data);
  //     // После успешного создания таба закрываем модальное окно
  //   //   setShowModal(false);
  //   } catch (error) {
  //     console.error('Error creating tab:', error);
  //   }
  // };

  return (
    <div className="tabs">
      <div className="tab-header">
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className={`tab-header-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {child.props.title}
          </div>
        ))}
        <button onClick={() => openCreateTabModal()}>Create Tab</button>
      </div>
      <div className="tab-content">
        {React.Children.map(children, (child, index) =>
          index === activeIndex ? child : null
        )}
      </div>
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
    </div>
  );
};

const Tab = ({ title, children }) => {
  return <div className="tab">{children}</div>;
};

export { Tabs, Tab };
