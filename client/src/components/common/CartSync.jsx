import { useEffect, useRef } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

/**
 * Component to sync cart when user logs in/out
 * - On mount (if logged in): Load cart from server
 * - On login: Load cart from server
 * - On logout: Keep guest cart in localStorage
 */
export const CartSync = () => {
  const { user } = useAuth();
  const { loadCart, isLoggedIn } = useCart();
  const previousLoginState = useRef(isLoggedIn);

  useEffect(() => {
    // Load cart from server if user is logged in (on mount or after login)
    if (user && isLoggedIn) {
      loadCart();
    }
    
    // Update previous state
    previousLoginState.current = isLoggedIn;
  }, [user, isLoggedIn, loadCart]);

  return null; // This component doesn't render anything
};

export default CartSync;
