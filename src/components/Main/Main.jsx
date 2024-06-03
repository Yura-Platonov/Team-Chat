import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Tabs } from 'components/Tabs/Tabs';
import RoomList from '../RoomList/RoomList';
import css from './Main.module.css';
import { useAuth } from '../LoginForm/AuthContext';

function Main() {
  const [tabs, setTabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const { authToken } = useAuth();
  const didFetchTabs = useRef(false);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await axios.get('https://cool-chat.club/api/tabs/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        setTabs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tabs:', error);
      }
    };
  
    if (!didFetchTabs.current) {
      fetchTabs();
      didFetchTabs.current = true;
    }
  }, [authToken]);

  console.log(tabs);

  return (
    <div>
      <section className={css.welcome}>
        <h1 className={css.welcome_title}>Welcome every tourist <br /> to Coolchat</h1>
        <p className={css.welcome_text}>Chat about a wide variety of tourist equipment.<br />Communicate, get good advice and choose!</p>
      </section>
      {!isLoading && (
      <Tabs defaultActiveIndex={0}>
      {Array.isArray(tabs) && tabs.map(tab => (
        <div key={tab.id}>
          {console.log(tab)}
          {tab.name_tab}
        </div>
      ))}
    </Tabs>
    
      )}
      <RoomList />
    </div>
  );
}


export default Main;
