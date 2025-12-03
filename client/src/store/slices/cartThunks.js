import { createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

/**
 * Fetch cart from server
 * Backend returns: { cartItems: [...], total: ... }
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      console.log('fetchCart response:', response.data);
      
      const cartItems = response.data.cartItems || [];
      
      // Transform to client format
      return cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        product: {
          id: item.variant?.product?.id,
          name: item.variant?.product?.name,
          image: item.variant?.product?.images?.[0]?.imageUrl,
          variant: {
            id: item.variant?.id,
            price: item.variant?.price,
            size: item.variant?.size,
            color: item.variant?.color,
            stock: item.variant?.stock,
          }
        },
        addedAt: item.createdAt || new Date().toISOString()
      }));
    } catch (error) {
      console.error('fetchCart error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể tải giỏ hàng');
    }
  }
);

/**
 * Add item to cart on server
 */
export const addToCartServer = createAsyncThunk(
  'cart/addToCartServer',
  async ({ variantId, quantity, productData }, { rejectWithValue }) => {
    try {
      const response = await cartService.addItem(variantId, quantity);
      console.log('addToCartServer response:', response.data);
      return { variantId, quantity, productData };
    } catch (error) {
      console.error('addToCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  }
);

/**
 * Update cart item quantity on server
 */
export const updateCartServer = createAsyncThunk(
  'cart/updateCartServer',
  async ({ variantId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateItem(variantId, quantity);
      console.log('updateCartServer response:', response.data);
      return { variantId, quantity };
    } catch (error) {
      console.error('updateCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
    }
  }
);

/**
 * Remove item from cart on server
 */
export const removeFromCartServer = createAsyncThunk(
  'cart/removeFromCartServer',
  async (variantId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeItem(variantId);
      console.log('removeFromCartServer response:', response.data);
      return variantId;
    } catch (error) {
      console.error('removeFromCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  }
);

/**
 * Clear all cart items on server
 */
export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      console.log('clearCartServer response:', response.data);
      return true;
    } catch (error) {
      console.error('clearCartServer error:', error);
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa giỏ hàng');
    }
  }
);
