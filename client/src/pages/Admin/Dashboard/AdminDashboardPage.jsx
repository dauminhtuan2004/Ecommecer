import React, { useState, useEffect } from 'react';
import { 
  Package, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import dashboardService from '../../../services/dashboardService';
import toast from 'react-hot-toast';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';
import StatsCard from '../../../components/common/StatsCard';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, revenueData, ordersData, productsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenue(),
        dashboardService.getRecentOrders(),
        dashboardService.getTopProducts(),
      ]);

      setStats(statsData);
      setRevenue(revenueData);
      setRecentOrders(ordersData);
      setTopProducts(productsData);
    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOrderStatusVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      PROCESSING: 'info',
      SHIPPED: 'info',
      DELIVERED: 'success',
      CANCELLED: 'danger',
    };
    return variants[status] || 'default';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      PENDING: 'Chờ xử lý',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy',
    };
    return texts[status] || status;
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải dữ liệu..." />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng doanh thu"
          value={stats?.revenue?.total ? formatCurrency(stats.revenue.total) : '0 ₫'}
          icon={DollarSign}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          borderColor="border-green-500"
        />
        <StatsCard
          title="Tổng đơn hàng"
          value={stats?.orders?.total || 0}
          icon={Package}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          borderColor="border-blue-500"
        />
        <StatsCard
          title="Người dùng"
          value={stats?.users?.total || 0}
          icon={Users}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          borderColor="border-purple-500"
        />
        <StatsCard
          title="Sản phẩm"
          value={stats?.products?.total || 0}
          icon={ShoppingBag}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          borderColor="border-orange-500"
        />
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Đơn hàng gần đây
            </h2>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">#{order.id}</span>
                      <Badge variant={getOrderStatusVariant(order.status)}>
                        {getOrderStatusText(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.user.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Sản phẩm bán chạy
            </h2>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
            ) : (
              topProducts.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-600">
                        {item.product.category?.name}
                      </span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">
                        {item.product.brand?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{item.totalSold}</p>
                    <p className="text-xs text-gray-500">Đã bán</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {revenue && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            Doanh thu theo tháng ({revenue.year})
          </h2>
          <div className="grid grid-cols-12 gap-2">
            {revenue.monthly.map((item) => {
              const maxRevenue = Math.max(...revenue.monthly.map((m) => m.revenue));
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 0;

              return (
                <div key={item.month} className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-2 h-12 flex items-end">
                    {item.revenue > 0 ? formatCurrency(item.revenue).replace(' ₫', '') : '0'}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}px`, minHeight: item.revenue > 0 ? '10px' : '0' }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">T{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;