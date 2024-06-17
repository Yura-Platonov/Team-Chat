import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate();

  const login = (accessToken, refreshToken, username) => {
    setAuthToken(accessToken);
    localStorage.setItem('access_token', accessToken);

    setRefreshToken(refreshToken);
    localStorage.setItem('refresh_token', refreshToken);

    axios.get(`https://cool-chat.club/api/users/${username}`)
      .then((response) => {
        const userData = response.data;
        const { user_name, avatar, id } = userData;

        localStorage.setItem('user_name', user_name);
        localStorage.setItem('avatar', avatar);
        localStorage.setItem('user_id', id);

        setUser({ username, isAuthenticated: true });
        localStorage.setItem('user', JSON.stringify({ username, isAuthenticated: true }));
      })
      .catch((error) => {
        console.error('Ошибка при выполнении GET-запроса:', error);
      });
  };

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentPartnerId');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
    localStorage.removeItem('avatar');

  navigate('/');

  }, [navigate]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post('https://cool-chat.club/api/refresh', null, {
      params: {
        refresh_token: refreshToken
      }
      });
      const { access_token } = response.data;
      setAuthToken(access_token);
      localStorage.setItem('access_token', access_token);
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      logout();
    }
  }, [refreshToken, logout]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshAccessToken]);
  
  useEffect(() => {
    const checkInitialToken = async () => {
      if (authToken) {
        try {
          await axios.get('https://cool-chat.club/api/ass', {
            params: {
              token: authToken
            }
          });
          console.log('Token is valid');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            try {
              await refreshAccessToken();
            } catch (refreshError) {
              console.error('Unable to refresh token:', refreshError);
            }
          } else {
            logout();
          }
        }
      }
    };

    checkInitialToken();
  }, [authToken, refreshAccessToken, logout]);

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;