import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="px-4 py-4 border-t flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Hiển thị trang <span className="font-medium">{currentPage}</span> / {totalPages}
      </p>
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Trước
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export default Pagination;