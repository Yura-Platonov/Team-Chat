import React, { useState} from 'react';
import CreateTabModal from 'components/Modal/CreateTabModal';
import css from './Tabs.module.css';

const Tabs = ({ defaultActiveIndex, tabs }) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || 0);
  const [isCreateTabModalOpen, setIsCreateTabModalOpen] = useState(false);


  const openCreateTabModal = () => {
    setIsCreateTabModalOpen(true);
  };

  const closeCreateTabModal = (e) => {
    e?.stopPropagation();
    setIsCreateTabModalOpen(false);
  };

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className={css.tabs}>
      <div className={css.tabHeader}>
        {Array.isArray(tabs) && tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`${css.tabTitle} ${index === activeIndex ? css.active : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.name_tab}
          </div>
        ))}
        <button onClick={openCreateTabModal}>Create Tab</button>
      </div>
      <div className={css.tabContent}>
        {Array.isArray(tabs) && tabs.map((tab, index) =>
          index === activeIndex ? (
            <Tab key={tab.id} title={tab.name_tab}>
              <p>Content for {tab.name_tab}</p>
            </Tab>
          ) : null
        )}
      </div>
      <CreateTabModal isOpen={isCreateTabModalOpen} onClose={closeCreateTabModal} />
    </div>
  );
};

const Tab = ({ title, children }) => {
  return (
    <div className={css.tab}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export { Tabs, Tab };
