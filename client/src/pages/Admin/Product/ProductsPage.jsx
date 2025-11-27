import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../../../components/common/Button';
import ProductStats from '../../../components/admin/Product/ProductStats';
import ProductToolbar from '../../../components/admin/Product/ProductToolbar';
import ProductTable from '../../../components/admin/Product/ProductTable';
import ProductForm from '../../../components/admin/Product/ProductForm';
import VariantManager from '../../../components/admin/Product/VariantModal'; // Thêm import này
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import { useProducts } from '../../../hooks/useProducts';
import productService from '../../../services/productService';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const {
    products,
    categories,
    brands,
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
  
  // Thêm state cho variant management
  const [managingVariantsProduct, setManagingVariantsProduct] = useState(null);
  const [showVariantManager, setShowVariantManager] = useState(false);

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

  // Thêm hàm xử lý variant management
  const handleManageVariants = (product) => {
    setManagingVariantsProduct(product);
    setShowVariantManager(true);
  };

  const handleSaveVariants = async (productId, variantsData) => {
    try {
      // Lấy thông tin product hiện tại để xem variants cũ
      const currentProduct = products.find(p => p.id === productId);
      
      // Xác định variants cần xóa (có id nhưng không có trong data mới)
      const existingVariants = currentProduct?.variants || [];
      const newVariants = variantsData.filter(v => !v.id);
      const updatedVariants = variantsData.filter(v => v.id);
      
      // Xóa các variants không còn tồn tại
      const variantsToDelete = existingVariants.filter(existingV => 
        !variantsData.some(newV => newV.id === existingV.id)
      );
      
      // Xóa variants cũ
      for (const variant of variantsToDelete) {
        try {
          await productService.deleteVariant(variant.id);
        } catch (error) {
          console.error('Error deleting variant:', error);
        }
      }
      
      // Tạo variants mới
      const createFailures = [];
      for (const variant of newVariants) {
        try {
          // Always send valid positive numbers for price and stock
          let priceVal = parseFloat(variant.price);
          if (!Number.isFinite(priceVal) || priceVal <= 0) {
            priceVal = Number(currentProduct?.basePrice) > 0 ? Number(currentProduct.basePrice) : 1;
          }
          let stockVal = parseInt(variant.stock);
          if (!Number.isFinite(stockVal) || stockVal <= 0) {
            stockVal = 1;
          }

          await productService.addVariant(productId, {
            productId: Number(productId),
            size: variant.size || undefined,
            color: variant.color || undefined,
            price: priceVal,
            stock: stockVal,
            sku: variant.sku || undefined,
          });
        } catch (error) {
          console.error('Error adding variant:', error);
          console.error('Response data:', error?.response?.data);
          const errorMsg = error?.response?.data?.message
            ? Array.isArray(error.response.data.message)
              ? error.response.data.message.join('\n')
              : error.response.data.message
            : error.message;
          createFailures.push({ variant, error: error?.response?.data || error.message });
          toast.error(`Lỗi tạo variant: ${errorMsg}`);
        }
      }
      if (createFailures.length > 0) {
        console.error('Some variant creations failed:', createFailures);
        toast.error(`Không thể tạo ${createFailures.length} variant. Xem console để biết chi tiết`);
      }
      
      // Cập nhật variants hiện có
      const updateFailures = [];
      for (const variant of updatedVariants) {
        try {
          // Always send valid positive numbers for price and stock
          let priceVal = parseFloat(variant.price);
          if (!Number.isFinite(priceVal) || priceVal <= 0) {
            priceVal = Number(currentProduct?.basePrice) > 0 ? Number(currentProduct.basePrice) : 1;
          }
          let stockVal = parseInt(variant.stock);
          if (!Number.isFinite(stockVal) || stockVal <= 0) {
            stockVal = 1;
          }

          await productService.updateVariant(variant.id, {
            productId: Number(productId),
            size: variant.size || undefined,
            color: variant.color || undefined,
            price: priceVal,
            stock: stockVal,
            sku: variant.sku || undefined,
          });
        } catch (error) {
          console.error('Error updating variant:', error);
          console.error('Response data:', error?.response?.data);
          updateFailures.push({ variant, error: error?.response?.data || error.message });
        }
      }
      if (updateFailures.length > 0) {
        console.error('Some variant updates failed:', updateFailures);
        toast.error(`Không thể cập nhật ${updateFailures.length} variant. Xem console để biết chi tiết`);
      }
      
      toast.success('Đã cập nhật biến thể thành công');
      setShowVariantManager(false);
      setManagingVariantsProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error saving variants:', error);
      toast.error('Không thể lưu biến thể');
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

  const handleSaveProduct = async (productData, images) => {
    try {
      if (editingProduct) {
        // Sanitize update payload to only include fields allowed by UpdateProductDto
        const updatePayload = {};
        if (productData.name !== undefined) updatePayload.name = productData.name?.trim();
        if (productData.description !== undefined) updatePayload.description = productData.description?.trim();
        if (productData.basePrice !== undefined) updatePayload.basePrice = parseFloat(productData.basePrice);
        if (productData.categoryId !== undefined && productData.categoryId !== '') updatePayload.categoryId = parseInt(productData.categoryId);

        await productService.update(editingProduct.id, updatePayload);
        // If there are variants provided during edit, add them as new variants
        const editVariants = productData.variants || [];
        const basePriceForEdit = productData.basePrice || editingProduct?.basePrice || 0;
        if (editVariants.length > 0) {
          for (const v of editVariants) {
            const parsedPrice = parseFloat(v.price);
            const price = Number.isFinite(parsedPrice) && parsedPrice > 0
              ? parsedPrice
              : parseFloat(basePriceForEdit);

            const parsedStock = parseInt(v.stock);
            const stock = Number.isFinite(parsedStock) && parsedStock > 0
              ? parsedStock
              : 1;

            const variantPayload = {
              size: v.size || undefined,
              color: v.color || undefined,
              price,
              stock,
              sku: v.sku || undefined,
            };
            try {
              await productService.addVariant(editingProduct.id, variantPayload);
            } catch (err) {
              console.error('Error adding variant for edited product', editingProduct.id, err);
            }
          }
        }

        // If there are selected images while editing, upload them
        if (images && images.length > 0) {
          const files = images.map(p => p.file).filter(Boolean);
          if (files.length > 0) {
            try {
              await productService.uploadImages(editingProduct.id, files);
              toast.success('Ảnh đã được upload');
            } catch (err) {
              console.error('Error uploading images after update:', err);
              toast.error('Không thể upload ảnh sau khi cập nhật');
            }
          }
        }
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        // Server's CreateProductDto doesn't accept `variants` property.
        // Create product first, then create variants via separate endpoint.
        const variants = productData.variants || [];
        // Sanitize and coerce fields to match CreateProductDto expectations
        const createPayload = {};
        if (productData.name !== undefined) createPayload.name = productData.name?.trim();
        if (productData.description !== undefined) createPayload.description = productData.description?.trim();
        if (productData.basePrice !== undefined) createPayload.basePrice = parseFloat(productData.basePrice);
        if (productData.categoryId !== undefined && productData.categoryId !== '') createPayload.categoryId = parseInt(productData.categoryId);
        if (productData.brandId !== undefined && productData.brandId !== '') createPayload.brandId = parseInt(productData.brandId);

        console.log('Creating product with payload:', createPayload);
        const res = await productService.create(createPayload);
        // axios returns response; product object usually in res.data
        const created = res?.data || res;

        // If there are variants, add them one by one (sequential to preserve order)
        if (variants.length > 0 && created?.id) {
          for (const v of variants) {
            const parsedPrice = parseFloat(v.price);
            const price = Number.isFinite(parsedPrice) && parsedPrice > 0
              ? parsedPrice
              : parseFloat(createPayload.basePrice);

            const parsedStock = parseInt(v.stock);
            const stock = Number.isFinite(parsedStock) && parsedStock > 0
              ? parsedStock
              : 1; // default to 1 to satisfy server validation

            const variantPayload = {
              size: v.size || undefined,
              color: v.color || undefined,
              price,
              stock,
              sku: v.sku || undefined,
            };
            try {
              await productService.addVariant(created.id, variantPayload);
            } catch (err) {
              console.error('Error adding variant for product', created.id, err);
            }
          }
        }

        // If there are selected images, upload them for the new product
        if (images && images.length > 0 && created?.id) {
          const files = images.map(p => p.file).filter(Boolean);
          if (files.length > 0) {
            try {
              await productService.uploadImages(created.id, files);
              toast.success('Ảnh sản phẩm đã được upload');
            } catch (err) {
              console.error('Error uploading images for product', created?.id, err);
              toast.error('Không thể upload ảnh cho sản phẩm mới');
            }
          }
        }

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
        onManageVariants={handleManageVariants} // Thêm prop này
        selectedProducts={selectedProducts}
        onSelectAll={handleSelectAll}
        onSelectProduct={handleSelectProduct}
      />

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          brands={brands}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Variant Manager Modal */}
      {showVariantManager && managingVariantsProduct && (
        <VariantManager
          product={managingVariantsProduct}
          onClose={() => {
            setShowVariantManager(false);
            setManagingVariantsProduct(null);
          }}
          onSave={handleSaveVariants}
          onImagesUploaded={loadProducts}
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