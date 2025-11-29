import { useState, memo } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";
import ProductActions from "./ProductActions";
import ProductDetails from "./ProductDetail";
import Button from "../../common/Button";
import { Edit, MoreVertical, Layers, ChevronDown, ChevronUp, Package } from 'lucide-react';

const ProductRow = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onManageVariants,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStockStatus = (stock) => {
    const n = Number(stock) || 0;
    if (n === 0)
      return {
        text: "Hết hàng",
        color: "text-rose-700 bg-rose-50 border-rose-200",
      };
    if (n < 10)
      return {
        text: "Sắp hết",
        color: "text-amber-700 bg-amber-50 border-amber-200",
      };
    return {
      text: "Còn hàng",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
  };

  const totalStock =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : Number(product.stock) || 0;
  const stockStatus = getStockStatus(totalStock);
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <>
      <tr
        className={`border-b border-gray-100 transition-all duration-200 ${
          isSelected ? "bg-blue-50/50" : "hover:bg-gray-50/50"
        }`}
      >
        {/* Checkbox */}
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
        </td>

        {/* Product Info */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].url || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 truncate mb-0.5">
                {product.name}
              </div>
              <div className="text-sm text-gray-500">
                {product.sku || "Chưa có SKU"}
              </div>
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="px-6 py-4">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {product.category?.name || "N/A"}
          </span>
        </td>

        {/* Price */}
        <td className="px-6 py-4">
          <div className="font-semibold text-gray-900">
            {formatPrice(product.basePrice)}
          </div>
        </td>

        {/* Stock */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{totalStock}</span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${stockStatus.color}`}
            >
              {stockStatus.text}
            </span>
          </div>
        </td>

        {/* Variants */}
        <td className="px-6 py-4">
          {hasVariants ? (
            <button
              onClick={() => onManageVariants(product)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
            >
              <Layers size={14} />
              {product.variants.length}
            </button>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              title="Chi tiết"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg p-2 transition-colors"
              title="Chỉnh sửa"
            >
              <Edit size={18} />
            </Button>

            {hasVariants && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onManageVariants(product)}
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg p-2 transition-colors"
                title="Biến thể"
              >
                <Layers size={18} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(true)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              title="Thêm"
            >
              <MoreVertical size={18} />
            </Button>
          </div>
        </td>
      </tr>

      {showActions && (
        <ProductActions
          product={product}
          onClose={() => setShowActions(false)}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onManageVariants={onManageVariants}
        />
      )}

      {/* Expanded Details */}
      {expanded && (
        <ProductDetails 
          product={product} 
          onEditVariant={(variant) => {
            // Open variant modal to edit specific variant
            onManageVariants(product, variant);
          }}
          onDeleteVariant={(variant) => {
            if (window.confirm(`Xóa variant "${variant.size} - ${variant.color}"?`)) {
              // Handle delete
              console.log('Delete variant:', variant);
            }
          }}
        />
      )}
    </>
  );
};

export default memo(ProductRow);
