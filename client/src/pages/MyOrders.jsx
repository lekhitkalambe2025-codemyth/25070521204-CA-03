import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { EmptyState, LoadingSpinner, ErrorMessage } from '../components/UIFeedback';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [notice, setNotice] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.orders.getMyOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Product stock will be returned to inventory.')) {
      return;
    }

    try {
      setCancellingId(orderId);
      const res = await api.orders.cancel(orderId);
      if (res.success) {
        setNotice({ type: 'success', text: 'Order cancelled successfully and stock restored.' });
        fetchOrders();
      } else {
        setNotice({ type: 'error', text: res.error || 'Failed to cancel order' });
      }
    } catch (err) {
      setNotice({ type: 'error', text: err.message || 'Error cancelling order' });
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Processing':
        return 'status-confirmed';
      case 'Shipped':
      case 'Delivered':
        return 'status-delivered';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="orders-page container">
      <div className="page-header">
        <span className="section-subheading">CUSTOMER ORDERS</span>
        <h1 className="page-title">My Order History</h1>
        <p className="page-subtitle">Track status updates and view receipts for all your simulated purchases</p>
      </div>

      {notice && (
        <div className={`alert ${notice.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
          {notice.text}
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Fetching your order history from MongoDB..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders placed yet"
          description="Explore our sports nutrition supplements and place your first simulated order."
          actionText="Shop Now →"
          onAction={() => (window.location.href = '/shop')}
        />
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

            return (
              <div key={order._id} className="order-history-card">
                {/* Header */}
                <div className="order-card-header flex-between">
                  <div>
                    <span className="order-label">Order Reference:</span>
                    <strong className="order-number">{order.orderNumber}</strong>
                    <span className="order-timestamp">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="order-header-right">
                    <span className={`status-pill ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="order-grand-total">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="order-card-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-inline">
                      <div className="order-item-meta">
                        <strong>{item.name}</strong>
                        <span className="order-item-qty">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="order-item-line-total">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer details */}
                <div className="order-card-footer flex-between">
                  <div className="order-footer-details">
                    <span>
                      Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                    </span>
                    <span>
                      Destination: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </span>
                  </div>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="btn-cancel-order"
                    >
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
