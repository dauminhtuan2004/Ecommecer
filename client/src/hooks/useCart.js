import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartItemsCount,
  selectIsInCart,
  selectItemQuantity,
  addToCartGuest,
  updateCartItemGuest,
  removeFromCartGuest,
  clearCartGuest,
  addToCartServer,
  updateCartServer,
  removeFromCartServer,
  clearCartServer,
  fetchCart,
} from '../store/slices/cartSlice';

// Helper: Check if user is logged in
const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Custom hook for cart operations
 * Provides optimized cart state and actions
 * Automatically handles logged in (server) vs guest (local) cart
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);
  const isLoggedIn = isUserLoggedIn();

  // Load cart from server if logged in
  const loadCart = useCallback(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  // Memoized actions - Auto switch between guest and server
  const addToCart = useCallback((variantId, quantity, productData) => {
    if (isLoggedIn) {
      dispatch(addToCartServer({ variantId, quantity, productData }));
    } else {
      dispatch(addToCartGuest({ variantId, quantity, productData }));
    }
  }, [dispatch, isLoggedIn]);

  const updateCartItem = useCallback((variantId, quantity) => {
    if (isLoggedIn) {
      dispatch(updateCartServer({ variantId, quantity }));
    } else {
      dispatch(updateCartItemGuest({ variantId, quantity }));
    }
  }, [dispatch, isLoggedIn]);

  const removeFromCart = useCallback((variantId) => {
    if (isLoggedIn) {
      dispatch(removeFromCartServer(variantId));
    } else {
      dispatch(removeFromCartGuest(variantId));
    }
  }, [dispatch, isLoggedIn]);

  const clearCart = useCallback(() => {
    if (isLoggedIn) {
      dispatch(clearCartServer());
    } else {
      dispatch(clearCartGuest());
    }
  }, [dispatch, isLoggedIn]);

  const isInCart = useCallback((variantId) => {
    return items.some(item => item.variantId === variantId);
  }, [items]);

  const getItemQuantity = useCallback((variantId) => {
    const item = items.find(item => item.variantId === variantId);
    return item?.quantity || 0;
  }, [items]);

  const getItem = useCallback((variantId) => {
    return items.find(item => item.variantId === variantId);
  }, [items]);

  return useMemo(() => ({
    items,
    count,
    total,
    itemsCount,
    isLoggedIn,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    getItem,
  }), [
    items,
    count,
    total,
    itemsCount,
    isLoggedIn,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    getItem,
  ]);
};

/**
 * Lightweight hook for components that only need cart count
 */
export const useCartCount = () => {
  return useSelector(selectCartCount);
};

/**
 * Lightweight hook for components that only need cart total
 */
export const useCartTotal = () => {
  return useSelector(selectCartTotal);
};

/**
 * Hook to check if a specific item is in cart
 */
export const useIsInCart = (variantId) => {
  return useSelector(state => selectIsInCart(variantId)(state));
};

/**
 * Hook to get quantity of a specific item
 */
export const useItemQuantity = (variantId) => {
  return useSelector(state => selectItemQuantity(variantId)(state));
};
