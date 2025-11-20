function ProductsPagination({ filteredProducts, products }) {
  return (
    filteredProducts.length > 0 && (
      <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
        <div className="text-sm text-gray-700">
          Showing 1 to {filteredProducts.length} of {products.length} products
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</span>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    )
  );
}

export default ProductsPagination;
