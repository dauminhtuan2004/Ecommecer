// src/services/productService.js
import axiosInstance from "../config/api.config";

const productService = {
  // Get all products với pagination và filters
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = "", categoryId = "" } = params;
    return await axiosInstance.get("/products", {
      params: {
        page,
        limit,
        search,
        categoryId: categoryId || undefined,
      },
    });
  },

  // Get single product by ID
  getOne: async (id) => {
    return await axiosInstance.get(`/products/${id}`);
  },

  // Create new product
  create: async (productData) => {
    return await axiosInstance.post("/products", productData);
  },

  // Update product
  update: async (id, productData) => {
    return await axiosInstance.put(`/products/${id}`, productData);
  },

  // Delete product
  delete: async (id) => {
    return await axiosInstance.delete(`/products/${id}`, {
      data: { confirm: true },
    });
  },

  // Bulk delete products
 bulkDelete: async (productIds) => {
  const response = await axiosInstance.post('/products/bulk-delete', {
    productIds,
    confirm: true,
  });
  return response.data;
},

  // Add variant to product
  addVariant: async (productId, variantData) => {
    return await axiosInstance.post(
      `/products/${productId}/variant`,
      variantData
    );
  },

  // Add image to product
  addImage: async (productId, formData) => {
    const response = await axiosInstance.post(
      `/products/${productId}/image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
  // Get categories (for filter)
  getCategories: async () => {
    return await axiosInstance.get("/categories");
  },

  // Get brands (for filter)
  getBrands: async () => {
    return await axiosInstance.get("/brands");
  },
};

export default productService;
