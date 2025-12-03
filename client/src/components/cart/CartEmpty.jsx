import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import Button from '../common/Button';

const CartEmpty = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-sm p-12">
        <FaShoppingBag className="mx-auto text-gray-300 mb-6" size={120} />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Giỏ hàng trống
        </h2>
        <p className="text-gray-600 mb-8">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
        </p>
        <Link to="/products">
          <Button variant="dark" icon={FaShoppingBag}>
            Mua sắm ngay
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
