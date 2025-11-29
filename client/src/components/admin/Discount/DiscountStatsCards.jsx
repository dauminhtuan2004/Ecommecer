import { Ticket, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import StatsCard from '../../common/StatsCard';

const DiscountStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Tổng mã giảm giá',
      value: stats.total,
      icon: Ticket,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-500',
    },
    {
      title: 'Đang hoạt động',
      value: stats.active,
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-500',
    },
    {
      title: 'Đã hết hạn',
      value: stats.expired,
      icon: XCircle,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-500',
    },
    {
      title: 'Sắp diễn ra',
      value: stats.upcoming,
      icon: Clock,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-500',
    },
    {
      title: 'Tổng lượt sử dụng',
      value: stats.totalUsage,
      icon: TrendingUp,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DiscountStatsCards;
