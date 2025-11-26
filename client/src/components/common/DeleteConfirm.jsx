// src/components/admin/DeleteConfirmModal.jsx
import Button from '../common/Button';
import Modal from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác Nhận Xóa',
  message,
  itemName,
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <p className="text-sm text-red-800 font-medium">
              {message || 'Hành động này không thể hoàn tác!'}
            </p>
            {itemName && (
              <p className="text-sm text-red-700 mt-1">
                Bạn có chắc muốn xóa <span className="font-semibold">"{itemName}"</span>?
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;