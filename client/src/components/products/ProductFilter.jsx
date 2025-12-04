import { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import Button from '../common/Button';
import Select from '../common/Select';

const ProductFilter = ({ 
  categories = [], 
  brands = [],
  priceRange = { minPrice: 0, maxPrice: 10000000 },
  onFilterChange,
  currentFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: currentFilters.categoryId || '',
    brandId: currentFilters.brandId || '',
    minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
    maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
    sortBy: currentFilters.sortBy || 'newest',
    inStock: currentFilters.inStock || false,
  });

  // Update filters when currentFilters or priceRange change
  useEffect(() => {
    setFilters({
      categoryId: currentFilters.categoryId || '',
      brandId: currentFilters.brandId || '',
      minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
      maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
      sortBy: currentFilters.sortBy || 'newest',
      inStock: currentFilters.inStock || false,
    });
  }, [currentFilters, priceRange]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  // Auto-apply filters when sortBy, minPrice, or maxPrice change
  const handleAutoApplyChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categoryId: '',
      brandId: '',
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
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
          onChange={(e) => handleAutoApplyChange('sortBy', e.target.value)}
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Danh mục
        </label>
        <Select
          value={filters.categoryId}
          onChange={(e) => handleAutoApplyChange('categoryId', e.target.value)}
          className="text-sm"
        >
          <option value="">Tất cả danh mục</option>
          {categories && categories.length > 0 && categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thương hiệu
          </label>
          <Select
            value={filters.brandId}
            onChange={(e) => handleAutoApplyChange('brandId', e.target.value)}
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

      {/* Price Range Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Khoảng giá: {filters.minPrice.toLocaleString('vi-VN')}đ - {filters.maxPrice.toLocaleString('vi-VN')}đ
        </label>
        <div className="relative pt-1">
          <div className="relative">
            {/* Background track */}
            <div className="absolute w-full h-2 bg-gray-200 rounded-lg top-1/2 -translate-y-1/2"></div>
            {/* Active range track */}
            <div 
              className="absolute h-2 bg-gray-900 rounded-lg top-1/2 -translate-y-1/2"
              style={{
                left: `${((filters.minPrice - priceRange.minPrice) / (priceRange.maxPrice - priceRange.minPrice)) * 100}%`,
                right: `${100 - ((filters.maxPrice - priceRange.minPrice) / (priceRange.maxPrice - priceRange.minPrice)) * 100}%`
              }}
            ></div>
            {/* Min price slider */}
            <input
              type="range"
              min={priceRange.minPrice}
              max={priceRange.maxPrice}
              step="100000"
              value={filters.minPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= filters.maxPrice) {
                  handleFilterChange('minPrice', value);
                }
              }}
              onMouseUp={() => {
                handleAutoApplyChange('minPrice', filters.minPrice);
              }}
              onTouchEnd={() => {
                handleAutoApplyChange('minPrice', filters.minPrice);
              }}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-900 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow"
            />
            {/* Max price slider */}
            <input
              type="range"
              min={priceRange.minPrice}
              max={priceRange.maxPrice}
              step="100000"
              value={filters.maxPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= filters.minPrice) {
                  handleFilterChange('maxPrice', value);
                }
              }}
              onMouseUp={() => {
                handleAutoApplyChange('maxPrice', filters.maxPrice);
              }}
              onTouchEnd={() => {
                handleAutoApplyChange('maxPrice', filters.maxPrice);
              }}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-900 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow"
            />
          </div>
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
