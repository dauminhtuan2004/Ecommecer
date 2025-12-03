const CART_STORAGE_KEY = 'shopping_cart';

/**
 * Load cart from localStorage
 */
export const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      // Handle both old format {items: []} and new format []
      return Array.isArray(parsed) ? parsed : (parsed.items || []);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
  return [];
};

/**
 * Save cart to localStorage - Debounced
 */
let saveTimeout;
export const saveCartToStorage = (items) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      console.log('Cart saved:', items.length, 'items');
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, 300);
};

/**
 * Clear cart from localStorage
 */
export const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    console.log('Cart storage cleared');
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
