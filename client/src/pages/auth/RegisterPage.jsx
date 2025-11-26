// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import  authService  from '../../services/authService';
import  Input  from '../../components/common/Input';
import  Button from '../../components/common/Button';
// import { Alert } from '../../components/common/Alert';
// import { Loading } from '../../components/common/Loading';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();
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
    if (!formData.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.access_token) {
        login(response.access_token, response.user);
        navigate('/');
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        {message && <Alert type="error" message={message} onClose={() => setMessage('')} />}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            label="Full name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <Input
            type="email"
            name="email"
            label="Email address"
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

          <Button type="submit" disabled={isLoading} fullWidth className="bg-indigo-600 hover:bg-indigo-700">
            {isLoading ? <Loading /> : 'Sign up'}
          </Button>
        </form>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;