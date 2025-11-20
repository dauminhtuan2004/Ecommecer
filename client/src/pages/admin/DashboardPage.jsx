import { DollarSign, Users, TrendingUp, Package } from 'lucide-react';
import StatsCard from '../../components/common/StarCard';
// import RecentOrders from '../../components/common/RecentOrders';

function DashboardPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$0.00',
      subtitle: 'From all orders',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total Customers',
      value: '+0',
      subtitle: 'Total registered users',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Sales',
      value: '+0',
      subtitle: 'Total sales transactions',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Products',
      value: '1',
      subtitle: 'Total available products',
      icon: Package,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Orders */}
      {/* <RecentOrders /> */}

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>

        {/* Top Products Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Product {item}</p>
                    <p className="text-xs text-gray-500">{10 - item * 2} sales</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">${(100 - item * 15)}.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;