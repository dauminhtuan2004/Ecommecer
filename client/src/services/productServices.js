import api from '../config/api';

export const getProducts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/products', {
      params: { page, limit },
    });
    console.log('API Response:', response.data); // Log để kiểm tra
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error);
    throw error.response?.data || { message: 'Lấy sản phẩm thất bại!' };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lấy chi tiết sản phẩm thất bại!' };
  }
};

export const createProduct = async (productData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('productData', JSON.stringify(productData));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Tạo sản phẩm thất bại!' };
  }
};

export const updateProduct = async (id, data) => { // data là FormData
  try {
    console.log('Sending FormData to update:', Object.fromEntries(data)); // Debug
    const response = await api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Update error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Cập nhật sản phẩm thất bại!' };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Xóa sản phẩm thất bại!' };
  }
};