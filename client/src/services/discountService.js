import api from '../config/api.config';

const discountService = {
  // Lấy danh sách mã giảm giá
  getDiscounts: async (params = {}) => {
    const response = await api.get('/discounts', { params });
    return response.data;
  },

  // Lấy chi tiết mã giảm giá
  getDiscount: async (id) => {
    const response = await api.get(`/discounts/${id}`);
    return response.data;
  },

  // Tạo mã giảm giá mới (Admin)
  createDiscount: async (data) => {
    const response = await api.post('/discounts', data);
    return response.data;
  },

  // Cập nhật mã giảm giá (Admin)
  updateDiscount: async (id, data) => {
    const response = await api.patch(`/discounts/${id}`, data);
    return response.data;
  },

  // Xóa mã giảm giá (Admin)
  deleteDiscount: async (id) => {
    const response = await api.delete(`/discounts/${id}`);
    return response.data;
  },

  // Validate mã giảm giá
  validateDiscount: async (code) => {
    const response = await api.post('/discounts/validate', { code });
    return response.data;
  },

  // Lấy thống kê (Admin)
  getStats: async () => {
    const response = await api.get('/discounts/stats');
    return response.data;
  },
};

export default discountService;
