export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusVariant = (status) => {
  const variants = {
    PENDING: 'warning',
    SUCCESS: 'success',
    FAILED: 'danger',
    REFUNDED: 'info',
  };
  return variants[status] || 'default';
};

export const getStatusText = (status) => {
  const texts = {
    PENDING: 'Chờ xử lý',
    SUCCESS: 'Thành công',
    FAILED: 'Thất bại',
    REFUNDED: 'Đã hoàn tiền',
  };
  return texts[status] || status;
};

export const getMethodText = (method) => {
  const texts = {
    CASH: 'Tiền mặt',
    CARD: 'Thẻ ngân hàng',
    VNPAY: 'VNPay',
    MOMO: 'MoMo',
  };
  return texts[method] || method;
};
