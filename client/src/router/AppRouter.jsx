import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'; // Import ResetPasswordPage
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import AdminLayout from '../pages/admin/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import ProductManagement from '../pages/admin/ProductManagement';
import DashboardPage from '../pages/admin/DashboardPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* Add this route */}
      
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductManagement />} />
        {/* <Route path="profile" element={<UserProfilePage />} /> */}
        {/* <Route path="orders" element={<OrdersPage />} /> */}
        {/* <Route path="users" element={<UsersPage />} /> */}
        {/* <Route path="categories" element={<CategoriesPage />} /> */}
        {/* <Route path="brands" element={<BrandsPage />} /> */}
        {/* <Route path="discounts" element={<DiscountsPage />} /> */}
        {/* <Route path="analytics" element={<AnalyticsPage />} /> */}
      </Route>
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;