import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

export const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="order-confirmation-page container">
      <div className="confirmation-card">
        {/* Success Header */}
        <div className="confirmation-header text-center">
          <div className="success-icon-badge">✓</div>
          <span className="section-subheading">SIMULATED ORDER PLACED</span>
          <h1 className="page-title">Thank You For Your Order!</h1>
          <p className="page-subtitle">
            Your simulated order has been registered in the local MongoDB database.
          </p>

          <div className="order-id-pill">
            <span>Database Order Reference:</span>
            <strong>{order.orderNumber}</strong>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="confirmation-details-grid">
          {/* Summary Box */}
          <div className="detail-box">
            <h4>Order Overview</h4>
            <div className="detail-line">
              <span>Status:</span>
              <span className="status-pill status-confirmed">{order.orderStatus}</span>
            </div>
            <div className="detail-line">
              <span>Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
            </div>
            <div className="detail-line">
              <span>Payment Mode:</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className="detail-line">
              <span>Payment Record:</span>
              <span className="badge-payment-status">{order.paymentStatus}</span>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="detail-box">
            <h4>Delivery Destination</h4>
            <p className="shipping-recipient">
              <strong>{order.shippingAddress?.fullName}</strong>
            </p>
            <p className="shipping-text">
              {order.shippingAddress?.addressLine}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>
        </div>

        {/* Purchased Items Table */}
        <div className="confirmation-items-section">
          <h4>Items Ordered ({order.items?.length || 0})</h4>

          <div className="confirmation-table-wrap">
            <table className="confirmation-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>₹{item.price.toLocaleString('en-IN')}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.subtotal.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'right' }}>Items Subtotal:</td>
                  <td>₹{order.subtotal?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ textAlign: 'right' }}>Delivery Charges:</td>
                  <td>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</td>
                </tr>
                <tr className="tfoot-grand-total">
                  <td colSpan="3" style={{ textAlign: 'right' }}>Total Order Value:</td>
                  <td><strong>₹{order.total?.toLocaleString('en-IN')}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions text-center">
          <Link to="/orders" className="btn-primary btn-large">
            Track in My Orders →
          </Link>
          <Link to="/shop" className="btn-secondary btn-large" style={{ marginLeft: '1rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
