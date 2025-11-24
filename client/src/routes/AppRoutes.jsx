// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Pages
import HomePage from '../pages/Home/HomePage';
import ShopPage from '../pages/Shop/ShopPage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';
import CartPage from '../pages/Cart/CartPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import OrderSuccessPage from '../pages/Checkout/OrderSuccessPage';

// Auth Pages
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';

// Account Pages
import AccountPage from '../pages/Account/AccountPage';
import ProfilePage from '../pages/Account/ProfilePage';
import OrdersPage from '../pages/Account/OrdersPage';
import OrderDetailPage from '../pages/Account/OrderDetailPage';
import AddressesPage from '../pages/Account/AddressesPage';

// Admin Pages
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import AdminProductsPage from '../pages/Admin/AdminProductsPage';
import AdminOrdersPage from '../pages/Admin/AdminOrdersPage';
import AdminUsersPage from '../pages/Admin/AdminUsersPage';

// Error Pages
import NotFoundPage from '../pages/Error/NotFoundPage';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Layout><CheckoutPage /></Layout>
          </ProtectedRoute>
        } />
        {/* <Route path="/order-success" element={
          <ProtectedRoute>
            <Layout><OrderSuccessPage /></Layout>
          </ProtectedRoute>
        } /> */}

        {/* Account Routes */}
        <Route path="/account" element={
          <ProtectedRoute>
            <Layout><AccountPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/account/profile" element={
          <ProtectedRoute>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/account/orders" element={
          <ProtectedRoute>
            <Layout><OrdersPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/account/orders/:id" element={
          <ProtectedRoute>
            <Layout><OrderDetailPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/account/addresses" element={
          <ProtectedRoute>
            <Layout><AddressesPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <AdminProductsPage />
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <AdminOrdersPage />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;