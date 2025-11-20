import { Edit, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react';

function ProductRow({
    product,
    selectedProducts,
    handleSelectProduct,
    getStatusBadge,
    isExpanded,
    toggleExpandedRow,
    onEditProduct,
    onDeleteProduct,
}) {
    return (
        <>
            <tr key={product.id} className="hover:bg-blue-50 transition-colors duration-150">
                <td className="px-4 py-3">
                    <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                </td>
                <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">#{product.id}</span>
                </td>
                <td className="px-4 py-3">
                    <div className="flex items-center">
                        {product.image ? (
                            <img
                                src={product.image} // Sử dụng trực tiếp URL Cloudinary
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                No Image
                            </div>
                        )}
                        <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.brand}</div>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                        {product.category ? product.category.name : 'N/A'}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-blue-700">${product.price}</span>
                </td>
                <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock === 0 
                            ? 'bg-red-100 text-red-800' 
                            : product.stock < 20 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                    }`}>
                        {product.stock}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{product.size || 'N/A'}</span>
                </td>
                <td className="px-4 py-3">
                    {product.color && (
                        <div className="flex items-center">
                            <span 
                                className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                                style={{ backgroundColor: product.color }}
                            ></span>
                            <span className="text-sm text-gray-700 capitalize">{product.color}</span>
                        </div>
                    )}
                </td>
                <td className="px-4 py-3">
                    {getStatusBadge(product.status, product.stock)}
                </td>
                <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => toggleExpandedRow(product.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                            title="View details"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={() => onEditProduct(product)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                            title="Edit product"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => onDeleteProduct(product)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                            title="Delete product"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-blue-50">
                    <td colSpan="10" className="px-4 py-4">
                        <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-100">
                            <div className="flex-shrink-0 flex justify-center">
                                {product.image ? (
                                    <img
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-2 border-blue-200"
                                    />
                                ) : (
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                                        {product.name}
                                    </h3>
                                    <span className="text-sm text-gray-500 mt-1 md:mt-0">ID: {product.id}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 mb-4">
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium">Category:</span>
                                        <span>{product.category ? product.category.name : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium">Price:</span>
                                        <span className="font-semibold text-blue-700">${product.price}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium">Stock:</span>
                                        <span className={product.stock === 0 ? 'text-red-600 font-medium' : product.stock < 20 ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>
                                            {product.stock} units
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium">Size:</span>
                                        <span>{product.size || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium">Color:</span>
                                        <div className="flex items-center">
                                            {product.color && (
                                                <>
                                                    <span 
                                                        className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                                                        style={{ backgroundColor: product.color }}
                                                    ></span>
                                                    <span className="capitalize">{product.color}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium">Status:</span>
                                        <span>{getStatusBadge(product.status, product.stock)}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <p className="font-medium text-gray-800 mb-2">Description:</p>
                                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                            {product.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default ProductRow;