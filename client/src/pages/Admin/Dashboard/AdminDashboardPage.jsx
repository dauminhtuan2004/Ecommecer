// src/pages/Admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
// import Layout from '../../../components/l';
import AdminRoute from '../../../routes/AdminRoute';
import StatsCard from '../../../components/admin/Dashboard/StatsCard';
import SalesChart from '../../../components/admin/Dashboard/SalesChart';
import RecentOrders from '../../../components/admin/Dashboard/RecentOrders';
// import { orderService } from '../../services/orderService'; 

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Fetch data (placeholder)
    const fetchData = async () => {
      try {
        const orders = await orderService.getOrders({ limit: 5 });
        setRecentOrders(orders);
        setStats({ orders: 150, revenue: 50000, users: 200, products: 500 });  // Mock data
      } catch (error) {
        console.error('Fetch dashboard error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminRoute>
      {/* <Layout showSidebar={true}> */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Export Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Orders" value={stats.orders} icon="📦" trend="+12%" />
            <StatsCard title="Revenue" value={`$${stats.revenue}`} icon="💰" trend="+8%" />
            <StatsCard title="New Users" value={stats.users} icon="👥" trend="+15%" />
            <StatsCard title="Products" value={stats.products} icon="🛍️" trend="-2%" />
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
            <SalesChart />
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow">
            <RecentOrders orders={recentOrders} />
          </div>
        </div>
      {/* </Layout> */}
    </AdminRoute>
  );
};

export default AdminDashboardPage;