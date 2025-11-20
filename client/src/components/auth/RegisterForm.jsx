import { useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function RegisterForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const { register, message, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
    if (!message.includes('thất bại')) {
      setTimeout(() => toggleForm('login'), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header với style hiện đại */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h2>
        <p className="text-gray-600 text-sm">Tạo tài khoản mới để bắt đầu mua sắm!</p>
      </div>

      {/* Message với hiệu ứng fade-in */}
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 transition-all duration-300">
          <p className="text-sm text-red-600 text-center">{message}</p>
        </div>
      )}

      {/* Form với input fields cải tiến */}
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="name"
              name="name"
              type="text"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="register-email"
              name="email"
              type="email"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="register-password"
              name="password"
              type="password"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </div>
          ) : (
            <div className="flex items-center">
              Đăng ký
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </button>
      </div>

      {/* Link với style đồng bộ */}
      <p className="text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleForm('login');
          }}
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
        >
          Đăng nhập
        </a>
      </p>
    </div>
  );
}

export default RegisterForm;