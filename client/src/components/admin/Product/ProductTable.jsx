import { memo } from 'react';
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
  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-200 rounded"></div></td>
      <td className="px-4 py-3"><div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded"></div>
        <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-200 rounded w-24"></div></div>
      </div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
      <td className="px-4 py-3"><div className="flex justify-end gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div></td>
    </tr>
  );

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
            {loading ? (
              // Show skeleton rows while loading
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : (
              products.map((product) => (
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
              ))
            )}
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

export default memo(ProductTable);