// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
// import Layout from '../components/layouts/Layout'; // Uncomment khi có Layout
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Auth Pages (đã có)
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import HomePage from '../pages/Home/HomePage';

// Placeholder cho Home (tạo tạm để tránh lỗi)


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/admin-dashboard" element={<HomePage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected (placeholder tạm) */}
      <Route path="/account" element={<ProtectedRoute><div>Account Page (Login để xem)</div></ProtectedRoute>} />

      {/* 404 */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;