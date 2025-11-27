import { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';
import toast from 'react-hot-toast';
import Button from '../../../components/common/Button';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      toast.error('Không thể tải danh mục');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        toast.error('Vui lòng nhập tên danh mục');
        return;
      }

      if (editingId) {
        await categoryService.updateCategory(editingId, formData);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Tạo danh mục thành công');
      }
      
      setFormData({ name: '' });
      setEditingId(null);
      setShowForm(false);
      loadCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra';
      toast.error(message);
      console.error(error);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryService.deleteCategory(id);
        toast.success('Xóa danh mục thành công');
        loadCategories();
      } catch (error) {
        const message = error.response?.data?.message || 'Không thể xóa danh mục';
        toast.error(message);
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Danh mục</h1>
          <p className="text-gray-600 mt-1">Tổng: {categories.length} danh mục</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm danh mục
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên danh mục"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  {editingId ? 'Cập nhật' : 'Tạo mới'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Đang tải danh mục...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Chưa có danh mục nào</p>
            <p className="text-gray-400">Nhấn "Thêm danh mục" để tạo mới</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {category.description || 'Không có mô tả'}
                </p>
              </div>

              {category._count?.products !== undefined && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">
                    {category._count.products} sản phẩm
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(category)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  <Edit size={16} />
                  Sửa
                </Button>
                <Button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
