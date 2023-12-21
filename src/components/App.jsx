import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header/Header';
import Main from './Main/Main';
import Chat from './Chat/Chat';
import PersonalChatPage from '../pages/PersonalChatPage/PersonalChatPage';
import PersonalChat from '../components/PersonalChat/PersonalChat';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import 'index.css';
import { AuthProvider } from 'components/LoginForm/AuthContext';
import Footer from './Footer/Footer';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const App = () => {
  const [authToken, setAuthToken] = useState(null);

  return (
    <div className="app">
      <AuthProvider value={{ authToken, setAuthToken }}>
        <Header />
        <Routes >
            <Route path="/" exact element={<Main/>} />  
            <Route path="/PersonalChatPage" element={<PersonalChatPage/>} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
            <Route path="/chat/:roomName" element={<Chat/>}/>
            <Route path="/PersonalChat/:recipient_name" element={<PersonalChat/>}/>

          </Routes>
        <Footer />
      </AuthProvider>
    </div>
  );
};