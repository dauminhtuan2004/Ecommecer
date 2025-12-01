import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import Button from '../../common/Button';
import Select from '../../common/Select';

const ProductFilter = ({ 
  categories = [], 
  brands = [],
  onFilterChange,
  currentFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: currentFilters.categoryId || '',
    brandId: currentFilters.brandId || '',
    minPrice: currentFilters.minPrice || '',
    maxPrice: currentFilters.maxPrice || '',
    sortBy: currentFilters.sortBy || 'newest',
    inStock: currentFilters.inStock || false,
  });

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categoryId: '',
      brandId: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      inStock: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
    { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sắp xếp
        </label>
        <Select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <Select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            className="text-sm"
          >
            <option value="">Tất cả</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thương hiệu
          </label>
          <Select
            value={filters.brandId}
            onChange={(e) => handleFilterChange('brandId', e.target.value)}
            className="text-sm"
          >
            <option value="">Tất cả</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Khoảng giá
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <input
            type="number"
            placeholder="Đến"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="dark"
          onClick={applyFilters}
          className="flex-1 text-sm"
        >
          Áp dụng
        </Button>
        <Button
          variant="outline"
          onClick={resetFilters}
          className="flex-1 text-sm"
        >
          Đặt lại
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;
