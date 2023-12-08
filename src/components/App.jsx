import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header/Header';
import Main from './Main/Main';
import Chat from './Chat/Chat';
import PersonalChat from '../pages/PersonalChat/PersonalChat'
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy'
import 'index.css';
import { AuthProvider } from 'components/LoginForm/AuthContext';
import Footer from './Footer/Footer';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const App = () => {
  const [authToken, setAuthToken] = useState(null);

  return (
    <Router>
    <div className="app">
      <AuthProvider value={{ authToken, setAuthToken }}>
        <Header />
        <Routes>
            <Route path="/Team-Chat" exact element={<Main/>} />  
            <Route path="/PersonalChat" element={<PersonalChat/>} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
            <Route path="/chat/:roomName" element={<Chat/>}/>

          </Routes>
        <Footer />
      </AuthProvider>
    </div>
    </Router>
  );
};