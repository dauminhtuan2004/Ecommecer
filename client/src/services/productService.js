import axiosInstance from "../config/api.config";

// Sử dụng named exports thay vì default export
export const productService = {
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

  // Update an existing variant
  updateVariant: async (variantId, variantData) => {
    return await axiosInstance.put(`/products/variant/${variantId}`, variantData);
  },

  // Delete a variant by its ID
  deleteVariant: async (variantId) => {
    return await axiosInstance.delete(`/products/variant/${variantId}`);
  },

  // ============ UPLOAD ẢNH TỪ MÁY TÍNH ============
  uploadImages: async (productId, files, metadata = {}) => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (metadata.altText) {
      formData.append('altText', metadata.altText);
    }
    if (metadata.isThumbnail !== undefined) {
      formData.append('isThumbnail', metadata.isThumbnail.toString());
    }

    const response = await axiosInstance.post(
      `/products/${productId}/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  // Xóa ảnh sản phẩm
  deleteImage: async (imageId) => {
    const response = await axiosInstance.delete(`/products/images/${imageId}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    try {
      console.log('📡 Fetching categories from API...');
      const response = await axiosInstance.get("/categories");
      console.log('✅ Categories API response:', response);
      
      // NestJS trả về trực tiếp array, không có data property
      if (Array.isArray(response)) {
        return { data: response };
      } else if (Array.isArray(response.data)) {
        return { data: response.data };
      } else {
        console.warn('⚠️ Unexpected categories response format:', response);
        return { data: [] };
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      // Fallback data
      return {
        data: [
          { id: 1, name: 'Thời Trang Nam' },
          { id: 2, name: 'Thời Trang Nữ' },
          { id: 3, name: 'Điện Thoại' },
          { id: 4, name: 'Máy Tính' },
        ]
      };
    }
  },

  // Get brands
  getBrands: async () => {
    try {
      console.log('📡 Fetching brands from API...');
      const response = await axiosInstance.get("/brands");
      console.log('✅ Brands API response:', response);
      
      if (Array.isArray(response)) {
        return { data: response };
      } else if (Array.isArray(response.data)) {
        return { data: response.data };
      } else {
        console.warn('⚠️ Unexpected brands response format:', response);
        return { data: [] };
      }
    } catch (error) {
      console.error('❌ Error fetching brands:', error);
      // Fallback data
      return {
        data: [
          { id: 1, name: 'Nike' },
          { id: 2, name: 'Adidas' },
          { id: 3, name: 'Apple' },
          { id: 4, name: 'Samsung' },
        ]
      };
    }
  },
};

// Hoặc nếu bạn muốn dùng default export, sửa import statement
export default productService;