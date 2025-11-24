// src/pages/Error/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          Trang không tồn tại
        </h2>
        <p className="text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home size={20} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;