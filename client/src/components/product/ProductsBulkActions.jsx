function ProductsBulkActions({ selectedProducts }) {
  return (
    selectedProducts.length > 0 && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">
            {selectedProducts.length} product(s) selected
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Bulk Edit
            </button>
            <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ProductsBulkActions;
