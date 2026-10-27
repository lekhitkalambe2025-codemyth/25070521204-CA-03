import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import QuantitySelector from '../components/QuantitySelector';
import PriceDisplay from '../components/PriceDisplay';
import { EmptyState, LoadingSpinner } from '../components/UIFeedback';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <EmptyState
          title="Sign in to view your shopping cart"
          description="Your cart is securely synchronized with your TATVA user account across sessions."
          actionText="Sign In Now →"
          onAction={() => navigate('/login?redirect=/cart')}
        />
      </div>
    );
  }

  if (loading && cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner message="Calculating real-time database totals..." />
      </div>
    );
  }

  const freeDeliveryThreshold = 999;
  const isFreeDelivery = cart.subtotal >= freeDeliveryThreshold;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - cart.subtotal);
  const deliveryProgress = Math.min(100, Math.round((cart.subtotal / freeDeliveryThreshold) * 100));

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <EmptyState
          title="Your shopping cart is empty"
          description="You haven't added any sports nutrition supplements to your cart yet."
          actionText="Explore Supplements Catalogue →"
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="page-header">
        <span className="section-subheading">YOUR ORDER SUMMARY</span>
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">
          {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your active shopping session
        </p>
      </div>

      {/* Stock Warnings Banner (if any item was adjusted on server) */}
      {cart.stockWarnings && cart.stockWarnings.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
          <strong>Inventory Adjustment:</strong>
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem' }}>
            {cart.stockWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Cart Grid Layout */}
      <div className="cart-layout">
        {/* Left Column: Items Table */}
        <div className="cart-items-column">
          <div className="free-shipping-bar">
            {isFreeDelivery ? (
              <span className="free-shipping-congrats">
                Congratulations! You have qualified for <strong>FREE Delivery</strong>!
              </span>
            ) : (
              <span>
                Add <strong>₹{amountToFreeDelivery.toLocaleString('en-IN')}</strong> more for FREE delivery
              </span>
            )}
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${deliveryProgress}%` }}
              />
            </div>
          </div>

          <div className="cart-table-wrap">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <tr key={product._id} className="cart-row">
                      {/* Product Info */}
                      <td className="cart-product-cell">
                        <Link to={`/products/${product.slug}`} className="cart-thumb-link">
                          <img
                            src={product.image || '/images/tatva-whey-isolate.svg'}
                            alt={product.name}
                            className="cart-thumb"
                            onError={(e) => {
                              e.target.src = '/images/tatva-whey-isolate.svg';
                            }}
                          />
                        </Link>
                        <div>
                          <Link to={`/products/${product.slug}`} className="cart-item-name">
                            {product.name}
                          </Link>
                          <span className="cart-item-cat">{product.category}</span>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="cart-unit-price">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      {/* Quantity Selector */}
                      <td>
                        <QuantitySelector
                          quantity={item.quantity}
                          maxStock={product.stockQuantity}
                          onChange={(newQty) => updateQuantity(product._id, newQty)}
                        />
                      </td>

                      {/* Item Subtotal */}
                      <td className="cart-line-total">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </td>

                      {/* Remove Button */}
                      <td>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product._id)}
                          className="btn-remove-item"
                          title="Remove item from cart"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="cart-bottom-actions flex-between">
            <Link to="/shop" className="btn-outline btn-sm">
              ← Continue Shopping
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="btn-clear-cart"
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="cart-summary-column">
          <div className="order-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-line">
              <span>Items Subtotal:</span>
              <strong>₹{cart.subtotal.toLocaleString('en-IN')}</strong>
            </div>

            <div className="summary-line">
              <span>Estimated Delivery Fee:</span>
              <span>
                {cart.deliveryFee === 0 ? (
                  <strong style={{ color: 'var(--color-olive-dark)' }}>FREE</strong>
                ) : (
                  `₹${cart.deliveryFee}`
                )}
              </span>
            </div>

            <div className="summary-line tax-note">
              <span>Taxes:</span>
              <span>Included in product prices</span>
            </div>

            <hr className="divider" />

            <div className="summary-line total-line">
              <span>Total Payable:</span>
              <span className="grand-total-amount">
                ₹{cart.total.toLocaleString('en-IN')}
              </span>
            </div>

            <Link to="/checkout" className="btn-primary btn-large btn-block" style={{ marginTop: '1.5rem' }}>
              Proceed to Simulated Checkout →
            </Link>

            <div className="checkout-trust-badges">
              <span>Academic Simulated Transaction</span>
              <span>Express Delivery across India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
