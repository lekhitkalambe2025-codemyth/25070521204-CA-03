import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { LoadingSpinner, ErrorMessage } from '../components/UIFeedback';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'reviews'

  // Metric state
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product management state
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState('all'); // 'all' | 'active' | 'removed'
  const [resettingDefaults, setResettingDefaults] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Protein',
    price: '',
    compareAtPrice: '',
    stockQuantity: 50,
    flavor: '',
    packSize: '',
    description: '',
    featured: false,
  });

  // Order management state
  const [adminOrders, setAdminOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Review management state
  const [adminReviews, setAdminReviews] = useState([]);

  // Toast / notification
  const [actionNotice, setActionNotice] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.admin.getDashboard();
      if (res.success) {
        setMetrics(res.metrics);
        setRecentOrders(res.recentOrders || []);
        setLowStockProducts(res.lowStockProducts || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await api.products.getAdminAll();
      if (res.success && res.products) {
        setProducts(res.products);
      }
    } catch (err) {
      console.warn('Error loading admin products via getAdminAll, using fallback:', err);
      try {
        const fallback = await api.products.getAll({ includeInactive: 'true', limit: 100 });
        if (fallback.success && fallback.products) {
          setProducts(fallback.products);
        }
      } catch (e) {
        console.error('Failed to load products:', e);
      }
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await api.orders.getAdminOrders({ status: orderStatusFilter });
      if (res.success && res.orders) {
        setAdminOrders(res.orders);
      }
    } catch (err) {
      console.warn('Error loading admin orders:', err);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const res = await api.reviews.getAdminAll();
      if (res.success && res.reviews) {
        setAdminReviews(res.reviews);
      }
    } catch (err) {
      console.warn('Error loading admin reviews:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (activeTab === 'products') fetchAllProducts();
    if (activeTab === 'orders') fetchAllOrders();
    if (activeTab === 'reviews') fetchAllReviews();
  }, [activeTab, orderStatusFilter]);

  const showNotice = (text, type = 'success') => {
    setActionNotice({ text, type });
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Stock update handler
  const handleSaveStock = async (productId) => {
    try {
      const qty = parseInt(stockInput, 10);
      if (isNaN(qty) || qty < 0) {
        showNotice('Stock must be a non-negative number', 'error');
        return;
      }
      const res = await api.products.updateStock(productId, qty);
      if (res.success) {
        showNotice('Inventory stock updated successfully');
        setEditingStockId(null);
        fetchAllProducts();
        fetchDashboardData();
      }
    } catch (err) {
      showNotice(err.message || 'Failed to update stock', 'error');
    }
  };

  // Product status toggle (Add to Store / Remove from Store)
  const handleToggleStatus = async (productId) => {
    // Optimistic local update so Add/Remove flips instantaneously without waiting
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, active: !p.active } : p))
    );

    try {
      const res = await api.products.toggleStatus(productId);
      if (res.success) {
        showNotice(res.message);
        if (res.product) {
          setProducts((prev) =>
            prev.map((p) => (p._id === productId ? res.product : p))
          );
        }
        fetchDashboardData();
      }
    } catch (err) {
      // Revert optimistic update on failure
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, active: !p.active } : p))
      );
      showNotice(err.message || 'Failed to update store status', 'error');
    }
  };

  // Restore 6 original core products
  const handleResetDefaults = async () => {
    try {
      setResettingDefaults(true);
      const res = await api.products.resetDefaults();
      if (res.success) {
        showNotice(res.message || 'Default 6 core products restored & added to store!');
        if (res.products) {
          setProducts(res.products);
        } else {
          fetchAllProducts();
        }
        fetchDashboardData();
      }
    } catch (err) {
      showNotice(err.message || 'Failed to restore default datasets', 'error');
    } finally {
      setResettingDefaults(false);
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        compareAtPrice: newProduct.compareAtPrice ? Number(newProduct.compareAtPrice) : undefined,
        stockQuantity: Number(newProduct.stockQuantity),
        image: '/images/tatva-whey-isolate.svg',
      };
      const res = await api.products.create(payload);
      if (res.success) {
        showNotice('New product added to catalogue');
        setShowCreateModal(false);
        setNewProduct({
          name: '',
          category: 'Protein',
          price: '',
          compareAtPrice: '',
          stockQuantity: 50,
          flavor: '',
          packSize: '',
          description: '',
          featured: false,
        });
        fetchAllProducts();
        fetchDashboardData();
      }
    } catch (err) {
      showNotice(err.message || 'Failed to create product', 'error');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.orders.updateStatus(orderId, newStatus);
      if (res.success) {
        showNotice(`Order status changed to ${newStatus}`);
        fetchAllOrders();
        fetchDashboardData();
      }
    } catch (err) {
      showNotice(err.message || 'Failed to update status', 'error');
    }
  };

  // Review delete
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this user review? This action will recalculate product ratings.')) {
      return;
    }
    try {
      const res = await api.reviews.delete(reviewId);
      if (res.success) {
        showNotice('Review removed from database');
        fetchAllReviews();
        fetchDashboardData();
      }
    } catch (err) {
      showNotice(err.message || 'Failed to delete review', 'error');
    }
  };

  return (
    <div className="admin-dashboard-page container">
      {/* Header */}
      <div className="admin-header flex-between">
        <div>
          <span className="section-subheading">TATVA NUTRITION BACKOFFICE</span>
          <h1 className="page-title">Admin Management Portal</h1>
          <p className="page-subtitle">
            Live database controls for products, stock inventory, customer orders, and reviews
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            + Create New Product
          </button>
        </div>
      </div>

      {actionNotice && (
        <div
          className={`alert ${
            actionNotice.type === 'success' ? 'alert-success' : 'alert-error'
          }`}
          style={{ marginBottom: '1.5rem' }}
        >
          {actionNotice.text}
        </div>
      )}

      {/* Tabs navigation */}
      <div className="admin-tabs-nav">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview & Metrics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
        >
          Product Inventory ({metrics?.totalProducts || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          Orders ({metrics?.totalOrders || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
        >
          Reviews Moderation ({metrics?.totalReviews || 0})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          {loading ? (
            <LoadingSpinner message="Calculating real-time database aggregations..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDashboardData} />
          ) : (
            <>
              {/* Metrics cards row */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Simulated Gross Revenue</span>
                    <strong className="metric-val">
                      ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Total Placed Orders</span>
                    <strong className="metric-val">{metrics?.totalOrders || 0}</strong>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Catalogue Products</span>
                    <strong className="metric-val">
                      {metrics?.totalProducts || 0}{' '}
                      <small>({metrics?.activeProducts} active)</small>
                    </strong>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-info">
                    <span className="metric-label">Registered Customers</span>
                    <strong className="metric-val">{metrics?.totalCustomers || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Low stock alerts & recent orders layout */}
              <div className="admin-overview-columns">
                {/* Low Stock Alerts */}
                <div className="admin-box">
                  <h3>Inventory Low Stock Alerts ({lowStockProducts.length})</h3>
                  {lowStockProducts.length === 0 ? (
                    <p className="clean-state-text">All products have adequate inventory.</p>
                  ) : (
                    <ul className="low-stock-list">
                      {lowStockProducts.map((p) => (
                        <li key={p._id} className="low-stock-item flex-between">
                          <div>
                            <strong>{p.name}</strong>
                            <span className="category-tag">{p.category}</span>
                          </div>
                          <span className="stock-alert-pill">
                            Only {p.stockQuantity} left
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="admin-box">
                  <h3>Recent Placed Orders</h3>
                  {recentOrders.length === 0 ? (
                    <p className="clean-state-text">No orders placed yet.</p>
                  ) : (
                    <ul className="recent-orders-list">
                      {recentOrders.map((o) => (
                        <li key={o._id} className="recent-order-item flex-between">
                          <div>
                            <strong>{o.orderNumber}</strong>
                            <small>{o.shippingAddress?.fullName} ({o.shippingAddress?.city})</small>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong>₹{o.total.toLocaleString('en-IN')}</strong>
                            <span className="status-mini-tag">{o.orderStatus}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 2: Products Inventory */}
      {activeTab === 'products' && (
        <div className="admin-tab-content">
          {/* Products Toolbar */}
          <div className="products-toolbar">
            <div className="products-filter-group">
              <button
                type="button"
                className={`filter-pill ${productFilter === 'all' ? 'active' : ''}`}
                onClick={() => setProductFilter('all')}
              >
                All Products ({products.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${productFilter === 'active' ? 'active' : ''}`}
                onClick={() => setProductFilter('active')}
              >
                In Store ({products.filter((p) => p.active).length})
              </button>
              <button
                type="button"
                className={`filter-pill ${productFilter === 'removed' ? 'active' : ''}`}
                onClick={() => setProductFilter('removed')}
              >
                Removed ({products.filter((p) => !p.active).length})
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleResetDefaults}
                disabled={resettingDefaults}
                className="btn-reset-defaults"
                title="Restore all 6 initial core products with active status & photography"
              >
                {resettingDefaults ? 'Restoring...' : 'Restore Default 6 Products'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                + Add New Product
              </button>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Qty</th>
                  <th>Store Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => {
                    if (productFilter === 'active') return p.active;
                    if (productFilter === 'removed') return !p.active;
                    return true;
                  })
                  .map((p) => (
                    <tr key={p._id} className={!p.active ? 'row-inactive' : ''}>
                      <td>
                        <strong>{p.name}</strong>
                        <small className="sku-sub">{p.sku || p.slug}</small>
                      </td>
                      <td>
                        <span className="badge-category">{p.category}</span>
                      </td>
                      <td>₹{p.price.toLocaleString('en-IN')}</td>
                      <td>
                        {editingStockId === p._id ? (
                          <div className="inline-edit-stock">
                            <input
                              type="number"
                              min="0"
                              value={stockInput}
                              onChange={(e) => setStockInput(e.target.value)}
                              className="input-stock-small"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveStock(p._id)}
                              className="btn-save-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingStockId(null)}
                              className="btn-cancel-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`stock-badge-click ${
                              p.stockQuantity <= 10 ? 'stock-low' : ''
                            }`}
                            onClick={() => {
                              setEditingStockId(p._id);
                              setStockInput(String(p.stockQuantity));
                            }}
                            title="Click to quickly adjust stock"
                          >
                            {p.stockQuantity} units (Edit)
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge-status ${
                            p.active ? 'status-active' : 'status-inactive'
                          }`}
                        >
                          {p.active ? 'In Store' : 'Hidden / Removed'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p._id)}
                          className={`btn-action-toggle ${
                            p.active ? 'btn-remove-store' : 'btn-add-store'
                          }`}
                          title={
                            p.active
                              ? 'Remove this product from the public store'
                              : 'Add this product back to the public store'
                          }
                        >
                          {p.active ? 'Remove' : 'Add'}
                        </button>
                      </td>
                    </tr>
                  ))}
                {products.filter((p) => {
                  if (productFilter === 'active') return p.active;
                  if (productFilter === 'removed') return !p.active;
                  return true;
                }).length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem' }}>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                        No products found under this view filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Tab 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="admin-tab-content">
          <div className="order-filter-bar flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="filterStatus">Filter Status:</label>
              <select
                id="filterStatus"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="select-custom"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <span>Total: {adminOrders.length} orders</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Amount</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <strong>{o.orderNumber}</strong>
                      <small>{new Date(o.createdAt).toLocaleDateString()}</small>
                    </td>
                    <td>
                      <strong>{o.shippingAddress?.fullName}</strong>
                      <small>{o.shippingAddress?.phone}</small>
                    </td>
                    <td>{o.shippingAddress?.city}, {o.shippingAddress?.state}</td>
                    <td><strong>₹{o.total.toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span className={`status-pill status-${o.orderStatus.toLowerCase()}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        className="select-custom status-select"
                        disabled={o.orderStatus === 'Cancelled' || o.orderStatus === 'Delivered'}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Reviews Moderation */}
      {activeTab === 'reviews' && (
        <div className="admin-tab-content">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Author</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {adminReviews.map((r) => (
                  <tr key={r._id}>
                    <td><strong>{r.product?.name || 'Deleted Product'}</strong></td>
                    <td>{r.userName}</td>
                    <td>⭐ {r.rating}/5</td>
                    <td>
                      <em>"{r.comment}"</em>
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(r._id)}
                        className="btn-delete-review"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create New Product */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header flex-between">
              <h3>Create New Product Formula</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="modal-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TATVA Plant Protein Vanilla"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="input-text"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="select-custom"
                  >
                    <option value="Protein">Protein</option>
                    <option value="Performance">Performance</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1999"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Compare Price (₹)</label>
                  <input
                    type="number"
                    placeholder="2499"
                    value={newProduct.compareAtPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Flavor</label>
                  <input
                    type="text"
                    placeholder="e.g. French Vanilla"
                    value={newProduct.flavor}
                    onChange={(e) => setNewProduct({ ...newProduct, flavor: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Pack Size / Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg"
                    value={newProduct.packSize}
                    onChange={(e) => setNewProduct({ ...newProduct, packSize: e.target.value })}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detailed formulation description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="input-textarea"
                />
              </div>

              <div className="modal-actions flex-between">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Product to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
