import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import ProductStats from '../../../components/admin/Product/ProductStats';
import ProductToolbar from '../../../components/admin/Product/ProductToolbar';
import ProductTable from '../../../components/admin/Product/ProductTable';
import ProductForm from '../../../components/admin/Product/ProductForm';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import { useProducts } from '../../../hooks/useProducts';
import productService from '../../../services/productService';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const {
    products,
    categories,
    brands, // Nhận brands từ hook
    loading,
    filters,
    totalPages,
    loadProducts,
    updateFilters
  } = useProducts();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Helper functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    setSelectedProducts(e.target.checked ? products.map(p => p.id) : []);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Product actions
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

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

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id);
      toast.success(`Đã xóa sản phẩm "${productToDelete.name}"`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

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
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lưu sản phẩm thất bại');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your product inventory and details</p>
      </div>

      {/* Stats */}
      <ProductStats 
        products={products}
        formatPrice={formatPrice}
        getTotalStock={getTotalStock}
      />

      {/* Toolbar */}
      <ProductToolbar
        search={filters.search}
        setSearch={(value) => updateFilters({ search: value, page: 1 })}
        selectedCategory={filters.categoryId}
        setSelectedCategory={(value) => updateFilters({ categoryId: value, page: 1 })}
        categories={categories}
        selectedProducts={selectedProducts}
        onBulkDelete={handleBulkDelete}
        onAddProduct={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}
      />

      {/* Products Table */}
      <ProductTable
        products={products}
        loading={loading}
        totalPages={totalPages}
        currentPage={filters.page}
        onPageChange={(page) => updateFilters({ page })}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        selectedProducts={selectedProducts}
        onSelectAll={handleSelectAll}
        onSelectProduct={handleSelectProduct}
      />

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          brands={brands} // Truyền brands vào form
          onSave={handleSaveProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        productToDelete={productToDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminProductsPage;