import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, switchRole, addRole } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const switchUserRole = async (role) => {
    try {
      const res = await switchRole({ role });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (error) {
      return false;
    }
  };
const addUserRole = async (roleData) => {
    try {
      const res = await addRole(roleData);
      // Refresh user data immediately
      const userRes = await getMe();
      setUser(userRes.data);
      // Switch to new role immediately
      const switchRes = await switchRole({ role: roleData.role });
      localStorage.setItem('token', switchRes.data.token);
      setToken(switchRes.data.token);
      setUser(switchRes.data.user);
      return true;
    } catch (error) {
      return false;
    }
  };
  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser, switchUserRole, addUserRole }}>
    
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;