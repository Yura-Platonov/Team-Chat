import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = (token, username) => {
    setAuthToken(token);
    localStorage.setItem('access_token', token);
  
    
    axios.get(`https://cool-chat.club/users/${username}`)
      .then((response) => {
        const user = response.data;
        const user_name = user.user_name;
  
        localStorage.setItem("user_name", user_name);
      })
      .catch((error) => {
        console.error("Ошибка при выполнении GET-запроса:", error);
      });
  
    const user = {
      username,
      isAuthenticated: true,
    };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };
  

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('access_token');
    
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
