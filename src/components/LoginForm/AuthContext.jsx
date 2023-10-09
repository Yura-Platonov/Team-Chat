import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));

  const login = () => {
    const token = localStorage.getItem('access_token');
    setAuthToken(token);
    console.log('token', token);
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
