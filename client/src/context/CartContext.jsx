import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
    stockWarnings: [],
  });
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        stockWarnings: [],
      });
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await api.cart.get();
      if (res.success && res.cart) {
        setCart(res.cart);
        const count = res.cart.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      console.warn('Could not load cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return {
        success: false,
        requireAuth: true,
        error: 'Please sign in to add products to your cart',
      };
    }

    try {
      const res = await api.cart.addItem(productId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
        const count = res.cart.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
        return { success: true, message: res.message };
      }
      throw new Error(res.error || 'Failed to add item to cart');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.cart.updateItem(productId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
        const count = res.cart.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
        return { success: true };
      }
      throw new Error(res.error || 'Failed to update item quantity');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.cart.removeItem(productId);
      if (res.success && res.cart) {
        setCart(res.cart);
        const count = res.cart.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
        return { success: true };
      }
      throw new Error(res.error || 'Failed to remove item');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const clearCart = async () => {
    try {
      await api.cart.clear();
      setCart({
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        stockWarnings: [],
      });
      setCartCount(0);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    cart,
    loading,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
