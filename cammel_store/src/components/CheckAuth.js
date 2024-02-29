import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);

  const login = (username) => {
    const user = { username };
    console.log(username + "login function")
    setUser(user);
    Cookies.set('user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'Lax' });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
