// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
//   const navigate = useNavigate();

//   const logout = useCallback(() => {
//     setAuthToken(null);
//     localStorage.removeItem('access_token');

//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('user_name');
//     localStorage.removeItem('avatar');

//     navigate('/');
//   }, [navigate]);

//   useEffect(() => {
//     const interceptor = axios.interceptors.response.use(
//       response => response,
//       error => {
//         if (error.response && error.response.status === 401) {
//           logout();
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, [logout]);
  
//   const login = (token, username) => {
//     setAuthToken(token);
//     localStorage.setItem('access_token', token);

//     axios.get(`https://cool-chat.club/api/users/${username}`)
//       .then((response) => {
//         const userData = response.data;
//         const { user_name, avatar } = userData;

//         localStorage.setItem('user_name', user_name);
//         localStorage.setItem('avatar', avatar);

//         setUser({ username, isAuthenticated: true });
//         localStorage.setItem('user', JSON.stringify({ username, isAuthenticated: true }));

//       })
//       .catch((error) => {
//         console.error('Ошибка при выполнении GET-запроса:', error);
//       });
//   };

//   return (
//     <AuthContext.Provider value={{ authToken, user, login, logout}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

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

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
    localStorage.removeItem('avatar');

    navigate('/');
  }, [navigate]);

  // useEffect(() => {
  //   if (!authToken) {
  //     logout();
  //   }
  // }, [authToken, logout]);


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

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post('https://cool-chat.club/api/post/refresh', { refresh_token: refreshToken });
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
        if (error.response && error.response.status === 401) {
          await refreshAccessToken();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [refreshAccessToken]);

  const login = (accessToken, refreshToken, username) => {
    setAuthToken(accessToken);
    localStorage.setItem('access_token', accessToken);

    setRefreshToken(refreshToken);
    localStorage.setItem('refresh_token', refreshToken);

    axios.get(`https://cool-chat.club/api/users/${username}`)
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
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
