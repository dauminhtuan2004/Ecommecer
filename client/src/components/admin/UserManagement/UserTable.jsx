// src/components/users/UserTable.jsx
import React from 'react';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import Badge from '../../common/Badge';

const UserTable = ({ users, onEdit, onDelete, onViewAddresses }) => {
  if (!users || users.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        Không tìm thấy người dùng
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vai trò
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Địa chỉ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.id}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {user.name || '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {user.email}
              </td>
              <td className="px-6 py-4">
                <Badge variant={user.role === 'ADMIN' ? 'admin' : 'customer'}>
                  {user.role === 'ADMIN' ? 'Admin' : 'Khách hàng'}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onViewAddresses(user)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  {user.addresses?.length || 0} địa chỉ
                </button>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors inline-flex"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;