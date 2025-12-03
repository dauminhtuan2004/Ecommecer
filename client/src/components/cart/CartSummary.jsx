import Button from '../common/Button';

const CartSummary = ({ total, selectedCount, totalCount, formatPrice, onCheckout }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm sticky top-8">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Tóm tắt đơn hàng
        </h2>

        {/* Selected Items Count */}
        {selectedCount !== undefined && totalCount !== undefined && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Đã chọn{' '}
              <span className="font-semibold text-blue-600">{selectedCount}</span>
              {' '}/ {totalCount} sản phẩm
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính</span>
            <span className="font-medium text-gray-900">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển</span>
            <span className="font-medium text-gray-900">
              Miễn phí
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Tổng cộng
              </span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="dark"
          fullWidth
          onClick={onCheckout}
          className="mb-4"
          disabled={selectedCount === 0}
        >
          Tiến hành thanh toán
        </Button>
        
        {selectedCount === 0 && (
          <p className="text-xs text-red-500 text-center -mt-2 mb-4">
            Vui lòng chọn ít nhất một sản phẩm
          </p>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Miễn phí vận chuyển toàn quốc
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Đổi trả trong 30 ngày
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Thanh toán an toàn
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
