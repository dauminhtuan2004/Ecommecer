import Button from '../../common/Button';
import Input from '../../common/Input';

const VariantSection = ({ variants, onVariantChange, onAddVariant, onRemoveVariant }) => {
  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-lg font-semibold text-gray-900">
          Variants
        </label>
        <Button type="button" variant="outline" size="sm" onClick={onAddVariant}>
          + Thêm Variant
        </Button>
      </div>
      
      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
              <Input
                type="text"
                placeholder="Size (M, L, XL)"
                value={variant.size}
                onChange={(e) => onVariantChange(index, "size", e.target.value)}
              />
              <Input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={(e) => onVariantChange(index, "color", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price Override"
                value={variant.price}
                onChange={(e) => onVariantChange(index, "price", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) => onVariantChange(index, "stock", e.target.value)}
              />
              <Input
                type="text"
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) => onVariantChange(index, "sku", e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onRemoveVariant(index)}
            >
              Xóa Variant
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantSection;