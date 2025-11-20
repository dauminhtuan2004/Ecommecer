  import { useState } from 'react';
  import { Plus } from 'lucide-react';
  import useProducts from '../../hooks/useProducts';
  import ProductsHeader from '../../components/product/ProductsHeader';
  import ProductsFilter from '../../components/product/ProductsFilter';
  import ProductsBulkActions from '../../components/product/ProductsBulkActions';
  import ProductsTable from '../../components/product/ProductsTable';
  import ProductsPagination from '../../components/product/ProductsPagination';
  import ProductFormModal from '../../components/product/ProductFormModal';
  import ConfirmationModal from '../../components/common/ConfirmationModal';

  function ProductsPage() {
    const { products, loading, error, addProduct, editProduct, removeProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusBadge = (status, stock) => {
      if (stock === 0) {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>;
      }
      if (status === 'Active') {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>;
      }
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    };

    const handleSelectProduct = (id) => {
      setSelectedProducts(prev =>
        prev.includes(id)
          ? prev.filter(productId => productId !== id)
          : [...prev, id]
      );
    };

    const handleSelectAll = () => {
      if (selectedProducts.length === products.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(products.map(product => product.id));
      }
    };

    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory ? (product.category && product.category.id == selectedCategory) : true;

      return matchesSearch && matchesCategory;
    });

    const handleAddProductClick = () => {
      setProductToEdit(null);
      setIsModalOpen(true);
    };

    const handleEditProductClick = (product) => {
      setProductToEdit(product);
      setIsModalOpen(true);
    };

    const handleDeleteProductClick = (product) => {
      setProductToDelete(product);
      setIsDeleteModalOpen(true);
    };

    const handleSaveProduct = async (id, productData) => {
      setIsSaving(true);
      try {
        if (id) {
          await editProduct(id, productData);
        } else {
          await addProduct(productData);
        }
      } catch (err) {
        console.error("Failed to save product:", err);
        // Optionally show a notification
      } finally {
        setIsSaving(false);
      }
    };

    const handleConfirmDelete = async () => {
      setIsDeleting(true);
      try {
        await removeProduct(productToDelete.id);
      } catch (err) {
        console.error("Failed to delete product:", err);
        // Optionally show a notification
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    };

    if (loading) {
      return <div className="text-center py-8">Loading products...</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-600">Error: {error.message}</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ProductsHeader />
          <button
            onClick={handleAddProductClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>

        <ProductsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ProductsBulkActions selectedProducts={selectedProducts} />

        <ProductsTable
          filteredProducts={filteredProducts}
          selectedProducts={selectedProducts}
          handleSelectAll={handleSelectAll}
          handleSelectProduct={handleSelectProduct}
          products={products}
          getStatusBadge={getStatusBadge}
          onEditProduct={handleEditProductClick}
          onDeleteProduct={handleDeleteProductClick}
        />

        <ProductsPagination filteredProducts={filteredProducts} products={products} />

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={productToEdit}
          onSave={handleSaveProduct}
          isLoading={isSaving}
        />

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Product"
          message={`Are you sure you want to delete product "${productToDelete?.name}"? This action cannot be undone.`}
          confirmButtonText="Delete"
          isConfirming={isDeleting}
        />
      </div>
    );
  }

  export default ProductsPage;