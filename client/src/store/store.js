import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date strings in cart items
        ignoredPaths: ['cart.items.*.addedAt'],
        // Improve performance by reducing checks
        warnAfter: 128,
      },
      // Enable additional checks in development
      immutableCheck: { warnAfter: 128 },
    }),
  devTools: import.meta.env.DEV && {
    name: 'E-Commerce Cart',
    trace: true,
    traceLimit: 25,
    // Customize DevTools features
    features: {
      pause: true,
      lock: true,
      persist: true,
      export: true,
      import: 'custom',
      jump: true,
      skip: true,
      reorder: true,
      dispatch: true,
      test: true,
    },
  },
});

// Enable hot module replacement for reducers in development
if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept('./slices/cartSlice', () => {
    store.replaceReducer({
      cart: cartReducer,
    });
  });
}

export default store;
