import { Package, AlertTriangle, XCircle } from "lucide-react";

const ProductStats = ({ products, formatPrice, getTotalStock }) => {
  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "blue",
    },
    {
      label: "Total Value",
      value: formatPrice(
        products.reduce((sum, p) => sum + (p.basePrice || 0), 0)
      ),
      icon: "💰",
      color: "green",
    },
    {
      label: "Low Stock",
      value: products.filter((p) => {
        const stock = getTotalStock(p.variants);
        return stock > 0 && stock < 10;
      }).length,
      icon: AlertTriangle,
      color: "orange",
    },
    {
      label: "Out of Stock",
      value: products.filter((p) => getTotalStock(p.variants) === 0).length,
      icon: XCircle,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p
                className={`text-2xl font-bold ${
                  stat.color === "orange"
                    ? "text-orange-600"
                    : stat.color === "red"
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {stat.value}
              </p>
            </div>
            {typeof stat.icon === "string" ? (
              <div className="text-green-600 text-2xl">{stat.icon}</div>
            ) : (
              <stat.icon className={`text-${stat.color}-600`} size={32} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
