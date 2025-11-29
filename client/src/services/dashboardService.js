import api from '../config/api.config';

const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get revenue analytics
  getRevenue: async () => {
    try {
      const response = await api.get('/dashboard/revenue');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent orders
  getRecentOrders: async () => {
    try {
      const response = await api.get('/dashboard/recent-orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get top products
  getTopProducts: async () => {
    try {
      const response = await api.get('/dashboard/top-products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
