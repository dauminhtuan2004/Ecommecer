import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../services/authServices';

export function useGoogleLogin() {
  const navigate = useNavigate();

  const handleGoogleLogin = async (credential) => {
    try {
      const response = await googleLogin(credential);
      
      // ✨ SỬA Ở ĐÂY: Truy cập vào `response.data`
      const role = response.data?.user?.role;

      if (role === 'CUSTOMER') {
        navigate('/'); // Điều hướng về trang chủ
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        // Trường hợp dự phòng nếu không có vai trò
        navigate('/');
      }
    } catch (error) {
      console.error("Google login failed on backend:", error);
      // Có thể thêm thông báo lỗi cho người dùng ở đây
    }
  };

  return { handleGoogleLogin };
}