// import React, { createContext, useContext, useState } from 'react';
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

//   const login = (token, username) => {
//     setAuthToken(token);
//     localStorage.setItem('access_token', token);
    
//     axios.get(`https://cool-chat.club/users/${username}`)
//       .then((response) => {
//         const user = response.data;
//         const user_name = user.user_name;
//         const avatar = user.avatar;

//         localStorage.setItem("user_name", user_name);
//         localStorage.setItem("avatar", avatar);
//         window.location.reload();
//       })
//       .catch((error) => {
//         console.error("Ошибка при выполнении GET-запроса:", error);
//       });

//     const user = {
//       username,
//       isAuthenticated: true,
//     };
//     setUser(user);
//     localStorage.setItem('user', JSON.stringify(user));
//   };

//   const logout = () => {
//     setAuthToken(null);
//     localStorage.removeItem('access_token');

//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('user_name');
//     localStorage.removeItem('avatar');

//     navigate('/');
//   };

//   return (
//     <AuthContext.Provider value={{ authToken, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

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
//   const [lastActivityTime, setLastActivityTime] = useState(Date.now());

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
//     const inactivityTimer = setInterval(() => {
//       const currentTime = Date.now();
//       const inactiveDuration = currentTime - lastActivityTime;
//       const logoutTime = 20000; // Время в миллисекундах (например, 1 час)

//       if (inactiveDuration > logoutTime && authToken) {
//         logout();
//       }
//     }, 10000); // Проверяем каждую минуту

//     return () => clearInterval(inactivityTimer);
//   }, [lastActivityTime, authToken, logout]);

//   const login = (token, username) => {
//     setAuthToken(token);
//     localStorage.setItem('access_token', token);

//     axios.get(`https://cool-chat.club/users/${username}`)
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

//   const updateLastActivityTime = () => {
//     setLastActivityTime(Date.now());
//   };

//   return (
//     <AuthContext.Provider value={{ authToken, user, login, logout, updateLastActivityTime }}>
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
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate();
  const [lastLoginTime, setLastLoginTime] = useState(Date.now());

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
    const inactivityTimer = setInterval(() => {
      const currentTime = Date.now();
      const loginDuration = currentTime - lastLoginTime;
      const logoutTime = 3600000; // Время в миллисекундах (например, 1 час)

      if (loginDuration > logoutTime && authToken) {
        logout();
      }
    }, 60000); // Проверяем каждую минуту

    return () => clearInterval(inactivityTimer);
  }, [lastLoginTime, authToken, logout]);

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

        setLastLoginTime(Date.now()); 
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
