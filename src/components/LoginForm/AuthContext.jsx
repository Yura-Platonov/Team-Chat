import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem('access_token');

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
    localStorage.removeItem('avatar');

    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);
  
  // useEffect(() => {
  //   const checkTokenValidity = async () => {
  //     try {
  //       await axios.get('https://cool-chat.club/ass', {
  //         params: {
  //           token: authToken 
  //         }
  //       });
        
  //       console.log('Token is valid');
  //     } catch (error) {
  //       if (error.response && error.response.status === 422) {
  //         console.log('Token is not valid');
  //         logout();
  //       }
  //     }
  //   };
  
  //   checkTokenValidity();
  
  // }, [authToken, logout]);
  

  const login = (token, username) => {
    setAuthToken(token);
    localStorage.setItem('access_token', token);

    axios.get(`https://cool-chat.club/users/${username}`)
      .then((response) => {
        const userData = response.data;
        const { user_name, avatar } = userData;

        localStorage.setItem('user_name', user_name);
        localStorage.setItem('avatar', avatar);

        setUser({ username, isAuthenticated: true });
        localStorage.setItem('user', JSON.stringify({ username, isAuthenticated: true }));

      })
      .catch((error) => {
        console.error('Ошибка при выполнении GET-запроса:', error);
      });
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
