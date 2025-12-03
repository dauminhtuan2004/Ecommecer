import CartItem from './CartItem';

const CartItemsList = ({ items, count, onUpdateQuantity, onRemove, onClearAll, formatPrice }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Sản phẩm ({count})
        </h2>
        <button
          onClick={onClearAll}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <CartItem
            key={item.variantId}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            formatPrice={formatPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default CartItemsList;
