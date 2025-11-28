// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/authContext";
// import ProtectedRoute from './ProtectedRoute';
// import AdminRoute from './AdminRoute';

// Layouts
import AdminLayout from "../components/layouts/AdminLayout";

// Auth Pages
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

// Public Pages
import HomePage from "../pages/Customer/Home/HomePage";

// Admin Pages
import AdminDashboardPage from "../pages/Admin/Dashboard/AdminDashboardPage";
import AdminProductsPage from "../pages/Admin/Product/ProductsPage";
import AdminCategoriesPage from "../pages/Admin/Category/CategoriesPage";
import AdminUsersPage from "../pages/Admin/User/UserManagement";
// import AdminOrdersPage from '../pages/Admin/Order/OrdersPage';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<HomePage />} /> */}

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="/account"
          element={
            // <ProtectedRoute>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold">Account Page (Customer)</h1>
            </div>
            // {/* </ProtectedRoute> */}
          }
        />
        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <HomePage />
            // </ProtectedRoute>
          }
        />

        {/* Admin Routes - WITH AdminLayout */}
        <Route
          path="/admin-dashboard"
          element={
            // <AdminRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
            // </AdminRoute>
          }
        />

        <Route
          path="/admin-products"
          element={
            // <AdminRoute>
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
            // </AdminRoute>
          }
        />

        <Route
          path="/admin-categories"
          element={
            // <AdminRoute>
            <AdminLayout>
              <AdminCategoriesPage />
            </AdminLayout>
            // </AdminRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            // <AdminRoute>

            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
            // </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
