// services/authServices.js
import api from '../config/api';

export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data; // { success, message, data: { user, token } }
  } catch (error) {
    throw error.response?.data || { message: 'Đăng ký thất bại!' };
  }
};

export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    const { data: { user, token, refreshToken } } = response.data; // Destructure nested data
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user data
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken); // Optional
      }
    }
    return response.data; // { success, message, data: { user, token, refreshToken } }
  } catch (error) {
    throw error.response?.data || { message: 'Đăng nhập thất bại!' };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const response = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { data: { user } } = response.data; // Get user from nested data
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Sync with backend
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw error.response?.data || { message: 'Không thể lấy thông tin người dùng!' };
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken'); // Remove refresh token if used
    // Optionally, call a backend logout endpoint if needed
    // await api.post('/auth/logout');
    return { message: 'Đăng xuất thành công!' };
  } catch (error) {
    console.error('Error logging out:', error);
    throw error.response?.data || { message: 'Đăng xuất thất bại!' };
  }
};

export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể gửi email đặt lại mật khẩu!' };
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    localStorage.removeItem('token'); // Clear token after reset
    localStorage.removeItem('user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Không thể đặt lại mật khẩu!' };
  }
};

export const googleLogin = async (token) => {
  try {
    const response = await api.post('/auth/google-login', { token });
    const { data: { user, token: googleToken, refreshToken } } = response.data;
    if (googleToken) {
      localStorage.setItem('token', googleToken);
      localStorage.setItem('user', JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng nhập bằng Google thất bại!' };
  }
};