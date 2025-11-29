import axiosInstance from "../config/api.config";

/**
 * Generic API Service với khả năng custom headers
 */
const apiService = {
  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {object} params - Query parameters
   * @param {object} headers - Custom headers
   */
  get: async (url, params = {}, headers = {}) => {
    try {
      const response = await axiosInstance.get(url, {
        params,
        headers: {
          ...headers
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} headers - Custom headers
   */
  post: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosInstance.post(url, data, {
        headers: {
          ...headers
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} headers - Custom headers
   */
  put: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosInstance.put(url, data, {
        headers: {
          ...headers
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} headers - Custom headers
   */
  patch: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosInstance.patch(url, data, {
        headers: {
          ...headers
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {object} data - Request body (optional)
   * @param {object} headers - Custom headers
   */
  delete: async (url, data = {}, headers = {}) => {
    try {
      const response = await axiosInstance.delete(url, {
        data,
        headers: {
          ...headers
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Upload file(s) with FormData
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data with files
   * @param {object} headers - Custom headers
   * @param {function} onUploadProgress - Progress callback
   */
  upload: async (url, formData, headers = {}, onUploadProgress = null) => {
    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        },
        onUploadProgress: onUploadProgress ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        } : undefined
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Download file
   * @param {string} url - API endpoint
   * @param {object} params - Query parameters
   * @param {object} headers - Custom headers
   */
  download: async (url, params = {}, headers = {}) => {
    try {
      const response = await axiosInstance.get(url, {
        params,
        headers: {
          ...headers
        },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default apiService;
