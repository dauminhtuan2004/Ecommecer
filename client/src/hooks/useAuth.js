// src/hooks/useAuth.js
import { useState } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await authService.register(data);
      setMessage(response.message || 'Đăng ký thành công!');
      return response;
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await authService.login(data);
      const role = response.user.role;
      setMessage(response.message || 'Đăng nhập thành công!');
      if (role === 'CUSTOMER') window.location.href = '/customer-dashboard';
      else if (role === 'ADMIN') window.location.href = '/admin-dashboard';
      return response;
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => authService.logout();

  return { handleRegister, handleLogin, handleLogout, loading, message, setMessage };
};
