// src/pages/Auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Input from "../../components/common/Input";       // ✅ default import
import Button from "../../components/common/Button";     // ✅ default import
import AuthLayout from "../../components/auth/AuthLayout";
import authService from "../../services/authService";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email là bắt buộc");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Email khôi phục đã được gửi!");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Kiểm tra email"
        subtitle="Chúng tôi đã gửi link khôi phục mật khẩu"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="text-green-600" size={32} />
          </div>

          <p className="text-gray-600">
            Chúng tôi đã gửi email khôi phục mật khẩu đến
          </p>

          <p className="font-semibold text-gray-900">{email}</p>

          <p className="text-sm text-gray-500">
            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn. Link sẽ hết hạn sau
            1 giờ.
          </p>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => setSent(false)}
              variant="outline"
              fullWidth
            >
              Không nhận được email? Gửi lại
            </Button>

            <div>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={16} />
                <span>Quay lại đăng nhập</span>
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để khôi phục mật khẩu"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <p>
            Nhập email đã đăng ký. Chúng tôi sẽ gửi link để đặt lại mật khẩu.
          </p>
        </div>

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          error={error}
          icon={Mail}
          required
        />

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Gửi link khôi phục
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft size={16} />
            <span>Quay lại đăng nhập</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
