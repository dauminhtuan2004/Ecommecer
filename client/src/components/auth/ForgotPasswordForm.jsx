import { useState } from 'react';
import { sendPasswordResetEmail } from '../../services/authServices';

function ForgotPasswordForm({ toggleForm }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await sendPasswordResetEmail(email);
      setMessage(response.message || 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
    } catch (err) {
      setMessage(err.message || 'Đã xảy ra lỗi khi gửi email đặt lại mật khẩu.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>
      {message && <p className="text-center text-sm text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 mt-4"
        >
          {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại mật khẩu'}
        </button>
      </form>
      <p className="text-center text-sm">
        <a href="#" onClick={(e) => { e.preventDefault(); toggleForm('login'); }} className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </a>
      </p>
    </div>
  );
}

export default ForgotPasswordForm;
