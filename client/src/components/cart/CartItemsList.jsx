import { useMemo } from 'react';
import CartItem from './CartItem';

const getProductImage = (item) => {
  return item.product?.image || 
         item.product?.variant?.product?.images?.[0]?.url ||
         item.product?.images?.[0]?.url;
};

const createVariant = (item) => ({
  variantId: item.variantId,
  size: item.product?.variant?.size,
  color: item.product?.variant?.color,
  price: item.product?.variant?.price || 0,
  stock: item.product?.variant?.stock || 999,
  quantity: item.quantity
});

const CartItemsList = ({ items, count, selectedItems, onToggleItem, onToggleAll, onUpdateQuantity, onRemove, onClearAll, formatPrice }) => {
  const allSelected = items.length > 0 && selectedItems.size === items.length;
  
  const groupedProducts = useMemo(() => {
    const groups = {};
    
    items.forEach(item => {
      const productId = item.product?.id;
      if (!productId) return;
      
      if (!groups[productId]) {
        groups[productId] = {
          productId,
          productName: item.product?.name,
          productImage: getProductImage(item),
          variants: [],
          totalQuantity: 0,
          totalPrice: 0
        };
      }
      
      const variant = createVariant(item);
      groups[productId].variants.push(variant);
      groups[productId].totalQuantity += item.quantity;
      groups[productId].totalPrice += (variant.price * item.quantity);
    });
    
    return Object.values(groups);
  }, [items]);

  const handleRemoveAll = async (variantIds) => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả biến thể của sản phẩm này?')) {
      for (const id of variantIds) {
        await onRemove(id, true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <h2 className="text-xl font-semibold text-gray-900">
            Chọn tất cả ({count} sản phẩm)
          </h2>
        </div>
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-4">
        {groupedProducts.map((groupedProduct) => (
          <CartItem
            key={groupedProduct.productId}
            groupedProduct={groupedProduct}
            selectedItems={selectedItems}
            onToggleItem={onToggleItem}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onRemoveAll={handleRemoveAll}
            formatPrice={formatPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default CartItemsList;
