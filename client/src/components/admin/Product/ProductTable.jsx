import Pagination from "../../common/Pagination";
import ProductRow from "./ProductRow";
import { Settings } from "lucide-react";

const ProductTable = ({
  products,
  loading,
  totalPages,
  currentPage,
  onEdit,
  onDelete,
  onDuplicate,
  onManageVariants,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onPageChange,
}) => {
  if (loading) return <div className="text-center p-8">Đang tải...</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                  onChange={onSelectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sản Phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tồn Kho
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Variants
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={() => onSelectProduct(product.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onManageVariants={onManageVariants}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ProductTable;