import React, { useMemo, useState } from 'react';
import { Edit2, Trash2, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import Badge from '../../common/Badge';

const UserTable = ({ users, onEdit, onDelete, onViewAddresses }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const sortedUsers = useMemo(() => {
    const data = [...users];
    const val = (u) => {
      if (sortBy === 'addresses') return (u.addresses?.length || 0);
      if (sortBy === 'role') return u.role || '';
      if (sortBy === 'email') return (u.email || '').toLowerCase();
      return (u.name || '').toLowerCase();
    };
    data.sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [users, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  if (!sortedUsers || sortedUsers.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        Không tìm thấy người dùng
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            {['Người dùng','Email','Vai trò','Địa chỉ'].map((label, idx) => (
              <th key={label} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="inline-flex items-center gap-1 hover:text-gray-700"
                  onClick={() => toggleSort(['name','email','role','addresses'][idx])}
                >
                  {label}
                  {sortBy === ['name','email','role','addresses'][idx] && (
                    sortDir === 'asc' ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  )}
                </button>
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedUsers.map((user, idx) => (
            <tr key={user.id} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50 transition-colors' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}>
              <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                {idx + 1}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                    {(user.name || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name || '-'}</div>
                  </div>
                </div>
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
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm transition-colors"
                >
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {user.addresses?.length || 0}
                  </span>
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