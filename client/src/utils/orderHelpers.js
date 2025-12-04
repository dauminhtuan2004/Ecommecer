import { formatPrice, formatDateTime } from './formatters';

// Format số tiền
export const formatCurrency = formatPrice;

// Format ngày tháng
export const formatDate = formatDateTime;

// Status variants
export const statusVariants = {
  PENDING: 'warning',
  PROCESSING: 'default',
  SHIPPED: 'default',
  DELIVERED: 'success',
  CANCELLED: 'danger',
};

// Status labels
export const statusLabels = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

// Status options for select
export const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'SHIPPED', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];
