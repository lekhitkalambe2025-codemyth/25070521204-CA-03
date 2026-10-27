/**
 * Centralized API service layer for TATVA Nutrition
 * Handles baseUrl, authorization headers, error parsing, and JSON serialization.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get stored JWT auth token from localStorage
 */
export const getStoredToken = () => {
  return localStorage.getItem('tatva_auth_token');
};

/**
 * Set or remove stored JWT auth token
 */
export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('tatva_auth_token', token);
  } else {
    localStorage.removeItem('tatva_auth_token');
  }
};

/**
 * Centralized request wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.error || data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

// ==========================================
// API Methods
// ==========================================

export const api = {
  // Health check
  getHealth: () => request('/health'),

  // Authentication
  auth: {
    register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) => request('/auth/profile', { method: 'PATCH', body: profileData }),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      const query = searchParams.toString();
      return request(`/products${query ? `?${query}` : ''}`);
    },
    getFeatured: () => request('/products/featured'),
    getBySlug: (slug) => request(`/products/${slug}`),
    compare: (ids) => request(`/products/compare?ids=${ids.join(',')}`),

    // Admin product operations
    getAdminAll: () => request('/products/admin/all'),
    resetDefaults: () => request('/products/admin/reset-defaults', { method: 'POST' }),
    create: (productData) => request('/products', { method: 'POST', body: productData }),
    update: (id, productData) => request(`/products/${id}`, { method: 'PATCH', body: productData }),
    updateStock: (id, stockQuantity) =>
      request(`/products/${id}/stock`, { method: 'PATCH', body: { stockQuantity } }),
    toggleStatus: (id) => request(`/products/${id}/status`, { method: 'PATCH' }),
  },

  // Cart
  cart: {
    get: () => request('/cart'),
    addItem: (productId, quantity = 1) =>
      request('/cart/items', { method: 'POST', body: { productId, quantity } }),
    updateItem: (productId, quantity) =>
      request(`/cart/items/${productId}`, { method: 'PATCH', body: { quantity } }),
    removeItem: (productId) =>
      request(`/cart/items/${productId}`, { method: 'DELETE' }),
    clear: () => request('/cart', { method: 'DELETE' }),
  },

  // Wishlist
  wishlist: {
    get: () => request('/wishlist'),
    add: (productId) => request(`/wishlist/${productId}`, { method: 'POST' }),
    remove: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
  },

  // Orders
  orders: {
    create: (orderPayload) => request('/orders', { method: 'POST', body: orderPayload }),
    getMyOrders: () => request('/orders/my'),
    getById: (id) => request(`/orders/${id}`),
    cancel: (id) => request(`/orders/${id}/cancel`, { method: 'POST' }),
    getAdminOrders: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/orders/admin/all${qs ? `?${qs}` : ''}`);
    },
    updateStatus: (id, status) =>
      request(`/orders/admin/${id}/status`, { method: 'PATCH', body: { status } }),
  },

  // Reviews
  reviews: {
    getByProduct: (productId) => request(`/reviews/product/${productId}`),
    create: (productId, reviewData) =>
      request(`/reviews/product/${productId}`, { method: 'POST', body: reviewData }),
    update: (id, reviewData) => request(`/reviews/${id}`, { method: 'PATCH', body: reviewData }),
    delete: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),
    getAdminAll: () => request('/reviews/admin/all'),
  },

  // Smart Product Finder
  finder: {
    find: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      return request(`/product-finder?${searchParams.toString()}`);
    },
  },

  // Admin Dashboard
  admin: {
    getDashboard: () => request('/admin/dashboard'),
  },
};

export default api;
