import api from '../config/api.config';

const paymentService = {
  // Get all payments with filters
  getPayments: async (params = {}) => {
    try {
      const response = await api.get('/payments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment by ID
  getPayment: async (id) => {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update payment status (Admin only)
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await api.put(`/payments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment statistics
  getStats: async () => {
    try {
      const response = await api.get('/payments/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
