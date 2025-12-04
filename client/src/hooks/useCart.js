import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartItemsCount,
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

const isUserLoggedIn = () => !!localStorage.getItem('token');

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);
  const isLoggedIn = useMemo(() => isUserLoggedIn(), []);

  const loadCart = useCallback(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  const addToCart = useCallback((variantId, quantity, productData) => {
    const action = isLoggedIn ? addToCartServer : addToCartGuest;
    dispatch(action({ variantId, quantity, productData }));
  }, [dispatch, isLoggedIn]);

  const updateCartItem = useCallback((variantId, quantity) => {
    const action = isLoggedIn ? updateCartServer : updateCartItemGuest;
    dispatch(action({ variantId, quantity }));
  }, [dispatch, isLoggedIn]);

  const removeFromCart = useCallback((variantId) => {
    const action = isLoggedIn ? removeFromCartServer : removeFromCartGuest;
    dispatch(action(variantId));
  }, [dispatch, isLoggedIn]);

  const clearCart = useCallback(() => {
    const action = isLoggedIn ? clearCartServer : clearCartGuest;
    dispatch(action());
  }, [dispatch, isLoggedIn]);

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
  ]);
};

// Lightweight hooks remain the same
export const useCartCount = () => useSelector(selectCartCount);
export const useCartTotal = () => useSelector(selectCartTotal);
