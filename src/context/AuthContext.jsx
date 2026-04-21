import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await axiosInstance.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
      } finally { setLoading(false); }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axiosInstance.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
};