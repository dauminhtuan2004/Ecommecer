export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};