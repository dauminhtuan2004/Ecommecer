// src/components/admin/ProductManagement/ProductTable.jsx (bổ sung bulk select, duplicate)
import React from 'react';
import Button from '../../common/Button';
import { Eye, Edit, Trash2, Copy ,Package} from 'lucide-react';  // Icons

const ProductTable = ({ 
  products, 
  loading, 
  totalPages, 
  currentPage, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  selectedProducts, 
  onSelectAll, 
  onSelectProduct 
}) => {
  if (loading) return <div className="text-center p-8">Đang tải...</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sản Phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tồn Kho
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Variants
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
              const stockStatus = totalStock === 0 ? 'Out of stock' : totalStock < 10 ? 'Low stock' : 'In stock';
              const isSelected = selectedProducts.includes(product.id);

              return (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectProduct(product.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          SKU: {product.variants && product.variants[0]?.sku || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {product.category?.name || 'N/A'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN').format(product.basePrice)} VND
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        totalStock === 0 ? 'bg-red-100 text-red-800' : totalStock < 10 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {stockStatus}
                      </span>
                      <span className="text-sm text-gray-900">{totalStock}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">
                      {product.variants?.length || 0} variant(s)
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem Chi Tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => onDuplicate(product)}
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Nhân Bản"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(product)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-4 border-t flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị trang <span className="font-medium">{currentPage}</span> / {totalPages}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Trước
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            disabled={currentPage >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;