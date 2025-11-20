import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/authServices';

function ResetPasswordForm({ token }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, password);
      setMessage(response.message || 'Mật khẩu của bạn đã được đặt lại thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Đặt lại mật khẩu</h2>
      {message && <p className="text-center text-sm text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <input
            id="password"
            name="password"
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 mt-4"
        >
          {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
