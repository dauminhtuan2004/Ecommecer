// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo user từ localStorage
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    initAuth();
  }, []);

  // Đăng ký
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      toast.success('Đăng ký thành công!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  // Đăng nhập
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      toast.success('Đăng nhập thành công!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  // Đăng xuất
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Đăng xuất thành công!');
  };

  // Cập nhật profile
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.user);
      toast.success('Cập nhật thông tin thành công!');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
      throw error;
    }
  };

  // Đổi mật khẩu
  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Đổi mật khẩu thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
      throw error;
    }
  };

  // Kiểm tra quyền admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;