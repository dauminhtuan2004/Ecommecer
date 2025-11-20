import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authServices';

export const useAuth = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await register(data);
      setMessage(response.message || 'Đăng ký thành công!');
      navigate('/login');
      return response;
    } catch (error) {
      setMessage(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      // response bây giờ có dạng { message, data: { user, token } }
      const response = await login(data); 
      setMessage(response.message || 'Đăng nhập thành công!');

      // ✨ SỬA Ở ĐÂY: Truy cập vào `response.data`
      const role = response.data?.user?.role; 
      
      if (role === 'CUSTOMER') {
        navigate('/'); // Điều hướng về trang chủ cho khách hàng
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard'); 
      } else {
        // Xử lý trường hợp không có vai trò hoặc đăng nhập thất bại mà không có lỗi
        // Vẫn nên điều hướng về trang chủ để người dùng không bị kẹt lại trang login
        navigate('/');
      }

      return response;
    } catch (error) {
      // Hiển thị thông báo lỗi từ server hoặc một thông báo chung
      setMessage(error.message || 'Email hoặc mật khẩu không chính xác.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { register: handleRegister, login: handleLogin, message, loading, setMessage };
};