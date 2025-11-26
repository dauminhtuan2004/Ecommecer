// src/pages/Admin/AdminProductsPage.jsx (bổ sung edit, delete, bulk delete)
import { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, MoreVertical, Edit, Eye, 
  Trash2, Copy, Package, AlertTriangle, CheckCircle, XCircle 
} from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Modal from '../../../components/common/Modal';  // Import Modal
import productService from '../../../services/productService';
import toast from 'react-hot-toast';
import ProductTable from '../../../components/admin/Product/ProductTable';  // Import table component
import ProductForm from '../../../components/admin/Product/ProductForm';  // Import form component

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
  const [editingProduct, setEditingProduct] = useState(null);  // Thêm cho edit
  const [showForm, setShowForm] = useState(false);  // Modal form cho edit/create

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
      
      // Handle response (array hoặc { data })
      const productsData = Array.isArray(response.data) ? response.data : response.data || [];
      setProducts(productsData);
      
      // Total pages (giả sử backend trả total, hoặc tính từ length nếu không)
      if (response.total) {
        setTotalPages(Math.ceil(response.total / 10));
      } else {
        setTotalPages(1);
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
      const categoriesData = Array.isArray(response.data) ? response.data : response.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Reload when filters change (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);  // Reset page khi search/filter
      loadProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

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
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // SỬA: Handle edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // XÓA: Single delete
  const handleDelete = (product) => {
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
      loadProducts();  // Refresh list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  // XÓA: Bulk delete
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    if (!confirm(`Bạn có chắc muốn xóa ${selectedProducts.length} sản phẩm?`)) return;

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

  // NHÂN BẢN: Duplicate product
  const handleDuplicate = async (product) => {
    try {
      const duplicateData = {
        name: `${product.name} (Copy)`,
        description: product.description,
        basePrice: product.basePrice,
        categoryId: product.categoryId,
        brandId: product.brandId,
        stock: product.stock,
      };
      
      await productService.create(duplicateData);
      toast.success('Đã nhân bản sản phẩm');
      loadProducts();
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Không thể nhân bản sản phẩm');
    }
  };

  // CẬP NHẬT: Handle save from form (create/update)
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, productData);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await productService.create(productData);
        toast.success('Tạo sản phẩm mới thành công!');
      }
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();  // Refresh
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lưu sản phẩm thất bại');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton */}
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

            <Button variant="primary" onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}>
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
      <ProductTable
        products={products}
        loading={loading}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        selectedProducts={selectedProducts}
        onSelectAll={handleSelectAll}
        onSelectProduct={handleSelectProduct}
      />

      {/* Edit/Create Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Xác Nhận Xóa Sản Phẩm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bạn có chắc muốn xóa sản phẩm "<span className="font-semibold">{productToDelete?.name}</span>"?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;