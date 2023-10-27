import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header/Header';
import Main from './Main/Main';
import Chat from './Chat/Chat';
import 'index.css';
import { AuthProvider } from 'components/LoginForm/AuthContext';
import Footer from './Footer/Footer';

export const App = () => {
  const [authToken, setAuthToken] = useState(null);

  return (
    <Router>
    <div className="app">
      <AuthProvider value={{ authToken, setAuthToken }}>
        <Header />
        <Routes>
            <Route path="/Team-Chat" exact element={<Main/>} />
            
            <Route path="/chat/:roomId" element={<Chat/>} />
          </Routes>
        <Footer />
      </AuthProvider>
    </div>
    </Router>
  );
};