import { Package, AlertTriangle, XCircle, DollarSign } from "lucide-react";
import StatsCard from "../../common/StatsCard";

const ProductStats = ({ products, formatPrice, getTotalStock }) => {
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500",
    },
    {
      title: "Total Value",
      value: formatPrice(
        products.reduce((sum, p) => sum + (p.basePrice || 0), 0)
      ),
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      borderColor: "border-green-500",
    },
    {
      title: "Low Stock",
      value: products.filter((p) => {
        const stock = getTotalStock(p.variants);
        return stock > 0 && stock < 10;
      }).length,
      icon: AlertTriangle,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      borderColor: "border-orange-500",
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => getTotalStock(p.variants) === 0).length,
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      borderColor: "border-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default ProductStats;
