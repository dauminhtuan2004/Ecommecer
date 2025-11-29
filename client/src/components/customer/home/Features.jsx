import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck size={32} />,
      title: 'Miễn Phí Vận Chuyển',
      description: 'Cho đơn hàng trên 500.000đ',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield size={32} />,
      title: 'Đảm Bảo Chất Lượng',
      description: 'Hoàn tiền 100% nếu lỗi',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Headphones size={32} />,
      title: 'Hỗ Trợ 24/7',
      description: 'Tư vấn nhiệt tình, tận tâm',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: <CreditCard size={32} />,
      title: 'Thanh Toán Đa Dạng',
      description: 'Hỗ trợ nhiều phương thức',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className={`flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white`}>
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
