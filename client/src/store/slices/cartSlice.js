import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from './cartHelpers';
import {
  fetchCart,
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
} from './cartThunks';

const initialState = {
  items: loadCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Guest cart actions (localStorage - persisted)
    addToCartGuest: (state, action) => {
      const { variantId, quantity, productData } = action.payload;
      const existingItem = state.items.find(item => item.variantId === variantId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          variantId,
          quantity,
          product: productData,
          addedAt: new Date().toISOString()
        });
      }

      // Save to localStorage
      saveCartToStorage(state.items);
      toast.success('Đã thêm vào giỏ hàng (tạm thời - đăng nhập để lưu vĩnh viễn)', { duration: 3000 });
    },

    updateCartItemGuest: (state, action) => {
      const { variantId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.variantId === variantId);

      if (itemIndex !== -1) {
        if (quantity < 1) {
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
        saveCartToStorage(state.items);
      }
    },

    removeFromCartGuest: (state, action) => {
      const variantId = action.payload;
      state.items = state.items.filter(item => item.variantId !== variantId);
      saveCartToStorage(state.items);
      toast.success('Đã xóa khỏi giỏ hàng', { duration: 2000 });
    },

    clearCartGuest: (state) => {
      state.items = [];
      clearCartStorage();
    },

    // Sync guest cart to server when user logs in
    syncGuestCartToServer: (state) => {
      // Keep items in state, will be synced by component
      saveCartToStorage(state.items);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      if (action.payload) {
        toast.error(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Save to localStorage for persistence
        saveCartToStorage(state.items);
        console.log('Cart loaded from server:', state.items.length, 'items');
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Failed to load cart from server:', action.payload);
      })
      // Add to Cart Server
      .addCase(addToCartServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartServer.fulfilled, (state, action) => {
        state.loading = false;
        const { variantId, quantity, productData } = action.payload;
        const existingItem = state.items.find(item => item.variantId === variantId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({
            variantId,
            quantity,
            product: productData,
            addedAt: new Date().toISOString()
          });
        }
        // Save to localStorage
        saveCartToStorage(state.items);
        toast.success('Đã lưu vào giỏ hàng!', { duration: 2000 });
      })
      .addCase(addToCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Update Cart Server
      .addCase(updateCartServer.fulfilled, (state, action) => {
        const { variantId, quantity } = action.payload;
        const itemIndex = state.items.findIndex(item => item.variantId === variantId);

        if (itemIndex !== -1) {
          if (quantity < 1) {
            state.items.splice(itemIndex, 1);
          } else {
            state.items[itemIndex].quantity = quantity;
          }
        }
        // Save to localStorage
        saveCartToStorage(state.items);
      })
      .addCase(updateCartServer.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Remove from Cart Server
      .addCase(removeFromCartServer.fulfilled, (state, action) => {
        const variantId = action.payload;
        state.items = state.items.filter(item => item.variantId !== variantId);
        // Save to localStorage
        saveCartToStorage(state.items);
        toast.success('Đã xóa khỏi giỏ hàng', { duration: 2000 });
      })
      .addCase(removeFromCartServer.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Clear Cart Server
      .addCase(clearCartServer.fulfilled, (state) => {
        state.items = [];
        clearCartStorage();
        toast.success('Đã xóa giỏ hàng', { duration: 2000 });
      })
      .addCase(clearCartServer.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

// Export actions
export const {
  addToCartGuest,
  updateCartItemGuest,
  removeFromCartGuest,
  clearCartGuest,
  syncGuestCartToServer,
  setLoading,
  setError,
} = cartSlice.actions;

// Re-export selectors and thunks for convenience
export {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartCount,
  selectCartTotal,
  selectCartItemsCount,
  selectIsInCart,
  selectItemQuantity,
  selectItemByVariantId,
} from './cartSelectors';

export {
  fetchCart,
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
} from './cartThunks';

export default cartSlice.reducer;
