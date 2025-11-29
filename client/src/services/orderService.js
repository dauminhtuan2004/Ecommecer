import api from '../config/api.config';

const orderService = {
  // Get all orders (admin can see all, users see their own)
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },

  // Get order statistics
  getStats: async () => {
    const response = await api.get('/orders', { params: { limit: 1000 } });
    return response.data;
  },
};

export default orderService;
