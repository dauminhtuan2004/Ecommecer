// src/routes/AppRoutes.jsx (Gộp hết vào một file)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
// Auth Pages
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import HomePage from '../pages/Home/HomePage';

// Admin Pages (placeholder, thay bằng thật sau)
import AdminDashboardPage from '../pages/Admin/Dashboard/AdminDashboardPage';

// Route guards are defined in separate files (ProtectedRoute, AdminRoute)

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected Customer Routes */}
      <Route 
        path="/account" 
        element={
          <ProtectedRoute>
            <div>Account Page (Customer)</div>  {/* Thay bằng AccountPage */}
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin-dashboard" 
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } 
      />
      {/* <Route 
        path="/admin-products" 
        element={
          <AdminRoute>
            <AdminProductsPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin-orders" 
        element={
          <AdminRoute>
            <AdminOrdersPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin-users" 
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        } 
      /> */}

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;