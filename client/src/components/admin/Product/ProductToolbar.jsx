import { Search, Filter, Plus } from 'lucide-react';
import Input from '../../common/Input';
import Button from '../../common/Button';

const ProductToolbar = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedProducts,
  onBulkDelete,
  onAddProduct
}) => {
  return (
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

          <Button variant="primary" onClick={onAddProduct}>
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
            <Button variant="secondary" size="sm" onClick={onBulkDelete}>
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductToolbar;