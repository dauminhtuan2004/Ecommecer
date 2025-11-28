// src/components/users/UserForm.jsx
import React, { useState } from 'react';
import { useUserForm } from '../../../hooks/useUserForm';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import Alert from '../../common/Alert';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const { formData, errors, validate, handleChange } = useUserForm(user);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setAlert(null);
    
    try {
      await onSubmit(formData);
      setAlert({
        type: 'success',
        message: user ? 'Cập nhật người dùng thành công!' : 'Tạo người dùng mới thành công!'
      });
      setTimeout(() => onCancel(), 1500);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Có lỗi xảy ra, vui lòng thử lại!'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        placeholder="user@example.com"
        disabled={!!user}
      />

      <Input
        label={user ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
        type="password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
        placeholder="••••••••"
      />

      <Input
        label="Tên"
        value={formData.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Nguyễn Văn A"
      />

      <Select
        label="Vai trò"
        value={formData.role}
        onChange={(e) => handleChange('role', e.target.value)}
        options={[
          { value: 'CUSTOMER', label: 'Khách hàng' },
          { value: 'ADMIN', label: 'Quản trị viên' },
        ]}
      />

      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Đang xử lý...' : (user ? 'Cập nhật' : 'Tạo mới')}
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default UserForm;