// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import  ProtectedRoute  from './ProtectedRoute'; // import ProtectedRoute {} from './ProtectedRoute';
// import  AdminRoute  from './AdminRoute';

// Auth Pages
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';

// Other Pages (placeholder, sẽ làm sau)
// import HomePage from '../pages/Home/HomePage';
// import ShopPage from '../pages/Shop/ShopPage';
// import CartPage from '../pages/Cart/CartPage';
// import CheckoutPage from '../pages/Checkout/CheckoutPage';
// import AccountPage from '../pages/Account/AccountPage';
// import NotFoundPage from '../pages/Error/NotFoundPage';
// import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';

 const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/shop" element={<ShopPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} /> */}

      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route 
        path="/account" 
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } 
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default AppRoutes;