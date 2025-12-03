import apiClient from '../config/api.config';

const cartService = {
  // Get current cart
  getCart: async () => {
    return await apiClient.get('/cart');
  },

  // Add item to cart
  addItem: async (variantId, quantity = 1) => {
    return await apiClient.post('/cart/items', {
      variantId,
      quantity,
    });
  },

  // Update item quantity
  updateItem: async (variantId, quantity) => {
    return await apiClient.put(`/cart/items/${variantId}`, {
      quantity,
    });
  },

  // Remove item from cart
  removeItem: async (variantId) => {
    return await apiClient.delete(`/cart/items/${variantId}`);
  },

  // Clear cart
  clearCart: async () => {
    return await apiClient.delete('/cart');
  },
};

export default cartService;
