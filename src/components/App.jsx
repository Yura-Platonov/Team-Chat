import React , { useState } from 'react';
import Header from './Header/Header';
import Main from './Main/Main';
import 'index.css';
import { AuthProvider } from 'components/LoginForm/AuthContext';

export const App = () => {
  const [authToken, setAuthToken] = useState(null);

  return (
    <div className="app">
      <AuthProvider value={{ authToken, setAuthToken }}>
        <Header />
        <Main />
      </AuthProvider>
    </div>
  );
};