// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/authContext";
import Loading from "../components/common/Loading";
// import ProtectedRoute from './ProtectedRoute';
// import AdminRoute from './AdminRoute';

// Layouts
import AdminLayout from "../components/layouts/AdminLayout";

// Auth Pages (eager load for quick access)
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

// Lazy load pages for better performance
const HomePage = lazy(() => import("../pages/Customer/Home/HomePage"));
const AdminDashboardPage = lazy(() => import("../pages/Admin/Dashboard/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("../pages/Admin/Product/ProductsPage"));
const AdminCategoriesPage = lazy(() => import("../pages/Admin/Category/CategoriesPage"));
const AdminUsersPage = lazy(() => import("../pages/Admin/User/UserManagement"));
const AdminOrdersPage = lazy(() => import("../pages/Admin/Order/OrderManagement"));
const AdminPaymentsPage = lazy(() => import("../pages/Admin/Payment/PaymentManagement"));
const AdminDiscountsPage = lazy(() => import("../pages/Admin/Discount/DiscountManagement"));
const AdminProfilePage = lazy(() => import("../pages/Admin/Profile/ProfilePage"));
const CustomerProfilePage = lazy(() => import("../pages/Customer/Profile/ProfilePage"));

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading fullScreen text="Loading page..." />}>
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/" element={<HomePage />} /> */}

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Customer Routes */}
        <Route path="/profile" element={<CustomerProfilePage />} />
        <Route path="/account" element={<CustomerProfilePage />} />
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

        <Route
          path="/admin-orders"
          element={
            // <AdminRoute>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
            // </AdminRoute>
          }
        />

        <Route
          path="/admin-payments"
          element={
            // <AdminRoute>
            <AdminLayout>
              <AdminPaymentsPage />
            </AdminLayout>
            // </AdminRoute>
          }
        />

        <Route
          path="/admin-discounts"
          element={
            // <AdminRoute>
            <AdminLayout>
              <AdminDiscountsPage />
            </AdminLayout>
            // </AdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            // <AdminRoute>
            <AdminLayout>
              <AdminProfilePage />
            </AdminLayout>
            // </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default AppRoutes;
