import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.wishlist.get();
      if (res.success && Array.isArray(res.wishlist)) {
        setWishlist(res.wishlist);
      }
    } catch (err) {
      console.warn('Could not load wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      return {
        success: false,
        requireAuth: true,
        error: 'Please sign in to save products to your wishlist',
      };
    }

    const productId = product._id || product;
    const exists = isInWishlist(productId);

    try {
      if (exists) {
        const res = await api.wishlist.remove(productId);
        if (res.success) {
          setWishlist(res.wishlist);
          return { success: true, added: false, message: 'Removed from wishlist' };
        }
      } else {
        const res = await api.wishlist.add(productId);
        if (res.success) {
          setWishlist(res.wishlist);
          return { success: true, added: true, message: 'Added to wishlist' };
        }
      }
      throw new Error('Could not update wishlist');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.wishlist.remove(productId);
      if (res.success) {
        setWishlist(res.wishlist);
        return { success: true };
      }
      throw new Error(res.error || 'Failed to remove from wishlist');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    wishlist,
    loading,
    wishlistCount: wishlist.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
