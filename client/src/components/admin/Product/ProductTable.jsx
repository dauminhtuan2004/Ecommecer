// src/components/admin/ProductManagement/ProductTable.jsx
import React from 'react';
import  Button  from '../../common/Button';

const ProductTable = ({ products, loading, total, currentPage, limit, onEdit, onDelete, onPageChange }) => {
  if (loading) return <div className="text-center p-8">Đang tải...</div>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá Cơ Bản</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hàng Tồn</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variants</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Images</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành Động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{new Intl.NumberFormat('vi-VN').format(product.basePrice)} VND</td>
              <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{product.category?.name || 'N/A'}</td>
              <td className="px-6 py-4 text-sm">
                {product.variants?.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {product.variants.map((v, i) => (
                      <li key={i}>{v.size} - {v.color} (Stock: {v.stock}, Giá: {new Intl.NumberFormat('vi-VN').format(v.price)} VND)</li>
                    ))}
                  </ul>
                ) : 'Không có'}
              </td>
              <td className="px-6 py-4 text-sm">
                {product.images?.length > 0 ? (
                  <div className="flex space-x-1">
                    {product.images.map((img, i) => (
                      <img key={i} src={img.url} alt="Product" className="w-8 h-8 object-cover rounded" />
                    ))}
                  </div>
                ) : 'Không có'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button onClick={() => onEdit(product)} variant="outline" size="sm">
                  Sửa
                </Button>
                <Button onClick={() => onDelete(product.id)} variant="danger" size="sm">
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination – giữ nguyên */}
      <div className="px-6 py-4 flex justify-between items-center bg-gray-50">
        <div className="text-sm text-gray-700">
          Hiển thị {((currentPage - 1) * limit) + 1} đến {Math.min(currentPage * limit, total)} của {total} sản phẩm
        </div>
        <div className="space-x-2">
          <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="sm">
            Trước
          </Button>
          <span className="px-3 py-2 text-sm">Trang {currentPage} / {totalPages}</span>
          <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" size="sm">
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;