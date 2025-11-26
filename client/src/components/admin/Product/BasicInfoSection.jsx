import Input from '../../common/Input';

const BasicInfoSection = ({ 
  formData, 
  categories = [], 
  brands = [], 
  onFormChange 
}) => {
  console.log('📋 BasicInfoSection props:', { 
    categoriesCount: categories.length, 
    brandsCount: brands.length,
    categories,
    brands
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          name="name"
          label="Tên Sản Phẩm"
          value={formData.name}
          onChange={(e) => onFormChange('name', e.target.value)}
          required
        />
        <Input
          type="number"
          name="basePrice"
          label="Giá Cơ Bản (VND)"
          value={formData.basePrice}
          onChange={(e) => onFormChange('basePrice', e.target.value)}
          required
        />
        <Input
          type="number"
          name="stock"
          label="Tồn Kho"
          value={formData.stock}
          onChange={(e) => onFormChange('stock', e.target.value)}
          required
        />
        
        {/* Dropdown chọn Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh Mục *
          </label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => onFormChange('categoryId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="" disabled>Đang tải danh mục...</option>
            )}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-orange-600 mt-1">Đang tải danh sách danh mục...</p>
          )}
        </div>

        {/* Dropdown chọn Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thương Hiệu
          </label>
          <select
            value={formData.brandId || ''}
            onChange={(e) => onFormChange('brandId', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Chọn thương hiệu</option>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))
            ) : (
              <option value="" disabled>Đang tải thương hiệu...</option>
            )}
          </select>
          {brands.length === 0 && (
            <p className="text-xs text-orange-600 mt-1">Đang tải danh sách thương hiệu...</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô Tả
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          value={formData.description}
          onChange={(e) => onFormChange('description', e.target.value)}
          placeholder="Mô tả chi tiết về sản phẩm..."
        />
      </div>
    </>
  );
};

export default BasicInfoSection;