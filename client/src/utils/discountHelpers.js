// Format số tiền
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Format ngày tháng
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Format ngày ngắn (chỉ ngày/tháng/năm)
export const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

// Lấy màu badge theo trạng thái
export const getStatusVariant = (status) => {
  const variants = {
    active: 'success',
    expired: 'danger',
    upcoming: 'warning',
  };
  return variants[status] || 'secondary';
};

// Lấy text hiển thị theo trạng thái
export const getStatusText = (status) => {
  const texts = {
    active: 'Đang hoạt động',
    expired: 'Đã hết hạn',
    upcoming: 'Sắp diễn ra',
  };
  return texts[status] || status;
};

// Lấy text loại giảm giá
export const getDiscountTypeText = (discount) => {
  if (discount.percentage) {
    return `${discount.percentage}%`;
  }
  if (discount.fixedAmount) {
    return formatCurrency(discount.fixedAmount);
  }
  return '-';
};

// Tính số tiền giảm
export const calculateDiscountAmount = (discount, orderTotal) => {
  if (discount.percentage) {
    return (orderTotal * discount.percentage) / 100;
  }
  if (discount.fixedAmount) {
    return Math.min(discount.fixedAmount, orderTotal);
  }
  return 0;
};
