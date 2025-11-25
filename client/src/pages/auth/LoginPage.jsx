// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Hook handleLogin
import Input from '../../components/common/Input'; // ✅ default import
import Button from '../../components/common/Button'; // ✅ default import
import AuthLayout from '../../components/auth/AuthLayout';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { handleLogin, loading: isLoading } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleLogin(formData);
      toast.success('Đăng nhập thành công!');
      // Redirect handled inside hook, nếu không thì dùng:
      // navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <AuthLayout title="Sign in" subtitle="Đăng nhập vào tài khoản của bạn">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <Input
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="h-4 w-4" />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500 text-sm">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Sign in'}
        </Button>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          fullWidth
          className="mt-3 flex items-center justify-center space-x-2"
        >
          <span>Sign in with Google</span>
        </Button>

        <div className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
