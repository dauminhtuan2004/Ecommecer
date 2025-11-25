// src/services/authService.js
import axiosInstance from "../config/api.config";

const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    if (response.data?.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    const { access_token, user } = response.data;
    if (access_token) {
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return { access_token, user }; // Trả data để hook dùng
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => localStorage.getItem("token"),

  isAuthenticated: () => !!localStorage.getItem("token"),

  updateProfile: async (userData) => {
    const token = authService.getToken();
    const response = await axiosInstance.put("/user/profile", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  changePassword: async (passwordData) => {
    const token = authService.getToken();
    const response = await axiosInstance.put(
      "/user/change-password",
      passwordData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default authService;
