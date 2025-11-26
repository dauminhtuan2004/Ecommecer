// src/pages/Admin/AdminProductsPage.jsx
import { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, MoreVertical, Edit, Eye, 
  Trash2, Copy, Package, AlertTriangle, CheckCircle, XCircle 
} from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
// import Modal from '../../../components/common/Modal';
import productService from '../../../services/productService';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        page,
        limit: 10,
        search,
        categoryId: selectedCategory,
      });
      
      // API trả về array trực tiếp hoặc object với data?
      const productsData = Array.isArray(response) ? response : response.data;
      setProducts(productsData || []);
      
      // Calculate total pages (giả sử có total trong response)
      if (response.total) {
        setTotalPages(Math.ceil(response.total / 10));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await productService.getCategories();
      const categoriesData = Array.isArray(response) ? response : response.data;
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Reload when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [search, selectedCategory, page]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of stock', color: 'red', icon: XCircle };
    if (stock < 10) return { label: 'Low stock', color: 'orange', icon: AlertTriangle };
    return { label: 'In stock', color: 'green', icon: CheckCircle };
  };

  const getTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleDelete = async (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id);
      toast.success(`Đã xóa sản phẩm "${productToDelete.name}"`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadProducts(); // Reload list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    if (!confirm(`Bạn có chắc muốn xóa ${selectedProducts.length} sản phẩm?`)) {
      return;
    }

    try {
      await productService.bulkDelete(selectedProducts);
      toast.success(`Đã xóa ${selectedProducts.length} sản phẩm`);
      setSelectedProducts([]);
      loadProducts();
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error('Không thể xóa các sản phẩm đã chọn');
    }
  };

  const handleDuplicate = async (product) => {
    try {
      const duplicateData = {
        name: `${product.name} (Copy)`,
        description: product.description,
        basePrice: product.basePrice,
        categoryId: product.categoryId,
        brandId: product.brandId,
      };
      
      await productService.create(duplicateData);
      toast.success('Đã nhân bản sản phẩm');
      loadProducts();
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Không thể nhân bản sản phẩm');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton Loading */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your product inventory and details</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(products.reduce((sum, p) => sum + (p.basePrice || 0), 0))}
              </p>
            </div>
            <div className="text-green-600 text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">
                {products.filter(p => {
                  const stock = getTotalStock(p.variants);
                  return stock > 0 && stock < 10;
                }).length}
              </p>
            </div>
            <AlertTriangle className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => getTotalStock(p.variants) === 0).length}
              </p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
            </button>

            <Button variant="primary" onClick={() => window.location.href = '/admin/products/create'}>
              <Plus size={20} className="mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="px-4 py-3 bg-blue-50 border-t border-blue-200 flex items-center justify-between">
            <span className="text-sm text-blue-900 font-medium">
              {selectedProducts.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleBulkDelete}>
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button variant="primary">
              <Plus size={20} className="mr-2" />
              Add First Product
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Variants
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => {
                    const totalStock = getTotalStock(product.variants);
                    const stockStatus = getStockStatus(totalStock);
                    const StockIcon = stockStatus.icon;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedProducts.includes(product.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
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
                            {formatPrice(product.basePrice)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <StockIcon size={16} className={`text-${stockStatus.color}-600`} />
                            <span className={`font-medium text-${stockStatus.color}-600`}>
                              {totalStock}
                            </span>
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
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDuplicate(product)}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              <Copy size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
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
                Showing page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages || 1}</span>
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {/* <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{productToDelete?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default AdminProductsPage;