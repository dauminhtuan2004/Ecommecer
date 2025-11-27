import api from '../config/api.config';

const brandService = {
  // Get all brands
  getBrands: async () => {
    const response = await api.get('/brands');
    return response.data;
  },

  // Get single brand
  getBrand: async (id) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  // Create brand
  createBrand: async (data) => {
    const response = await api.post('/brands', data);
    return response.data;
  },

  // Update brand
  updateBrand: async (id, data) => {
    const response = await api.put(`/brands/${id}`, data);
    return response.data;
  },

  // Delete brand
  deleteBrand: async (id) => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
};

export default brandService;
