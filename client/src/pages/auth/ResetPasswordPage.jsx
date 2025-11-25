// src/pages/Auth/ResetPasswordPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthLayout from '../../components/auth/AuthLayout';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!token || !email) {
      setErrors({ submit: 'Link không hợp lệ' });
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, email, formData.password);
      setSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
      
      // Redirect sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Link không hợp lệ hoặc đã hết hạn' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Thành công!"
        subtitle="Mật khẩu đã được đặt lại"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          
          <p className="text-gray-600">
            Mật khẩu của bạn đã được đặt lại thành công!
          </p>
          
          <p className="text-sm text-gray-500">
            Đang chuyển đến trang đăng nhập...
          </p>

          <Link
            to="/login"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      subtitle="Nhập mật khẩu mới của bạn"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {email && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <p>Đặt lại mật khẩu cho: <span className="font-semibold">{email}</span></p>
          </div>
        )}

        <Input
          label="Mật khẩu mới"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          required
        />

        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={Lock}
          required
        />

        <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-2">Mật khẩu phải:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Có ít nhất 6 ký tự</li>
            <li>Không trùng với mật khẩu cũ</li>
          </ul>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          Đặt lại mật khẩu
        </Button>

        <div className="text-center text-sm text-gray-600">
          Nhớ mật khẩu?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;