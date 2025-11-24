// src/services/authService.js
import axiosInstance from "./api/axiosInstance";

const authService = {
  // Đăng ký
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  },

  // Đăng nhập
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Kiểm tra đăng nhập
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    return await axiosInstance.post("/auth/forgot-password", { email });
  },

  // Reset mật khẩu
  resetPassword: async (token, password) => {
    return await axiosInstance.post("/auth/reset-password", {
      token,
      password,
    });
  },

  // Cập nhật profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.put("/auth/profile", userData);
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    return await axiosInstance.put("/auth/change-password", passwordData);
  },
};

export default authService;
