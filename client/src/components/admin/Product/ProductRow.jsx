import { Eye, Edit, Trash2, Copy, Package } from "lucide-react";

const ProductRow = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const stockStatus =
    totalStock === 0
      ? "Out of stock"
      : totalStock < 10
      ? "Low stock"
      : "In stock";

  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-blue-50" : ""
      }`}
    >
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package size={24} className="text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{product.name}</p>
            <p className="text-sm text-gray-500">
              SKU: {(product.variants && product.variants[0]?.sku) || "N/A"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
          {product.category?.name || "N/A"}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="font-medium text-gray-900">
          {new Intl.NumberFormat("vi-VN").format(product.basePrice)} VND
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              totalStock === 0
                ? "bg-red-100 text-red-800"
                : totalStock < 10
                ? "bg-orange-100 text-orange-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {stockStatus}
          </span>
          <span className="text-sm text-gray-900">{totalStock}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">
          {product.variants?.length || 0} variant(s)
        </span>
      </td>

      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Xem Chi Tiết"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Sửa"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDuplicate(product)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Nhân Bản"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
