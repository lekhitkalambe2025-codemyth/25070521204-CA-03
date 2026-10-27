import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  // Prefill address from customer profile if available
  const savedAddr = user?.addresses?.[0] || {};
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState(savedAddr.street || '');
  const [city, setCity] = useState(savedAddr.city || '');
  const [state, setState] = useState(savedAddr.state || '');
  const [postalCode, setPostalCode] = useState(savedAddr.postalCode || '');

  const [paymentMethod, setPaymentMethod] = useState('Simulated Online Payment');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/shop" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !phone || !addressLine || !city || !state || !postalCode) {
      setErrorMessage('Please fill in all mandatory shipping address fields');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          addressLine: addressLine.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
        },
        paymentMethod,
      };

      const res = await api.orders.create(orderPayload);

      if (res.success && res.order) {
        await refreshCart();
        navigate('/order-confirmation', {
          state: { order: res.order },
          replace: true,
        });
      } else {
        throw new Error(res.error || 'Failed to place simulated order');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Error occurred during simulated order placement'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container">
      {/* Mandatory Academic Disclaimer Banner */}
      <div className="academic-checkout-alert">
        <div>
          <strong>Educational Demonstration Checkout:</strong> Real financial transactions, credit card numbers, CVVs, and UPI pins are <strong>NOT</strong> collected or processed.
        </div>
      </div>

      <div className="checkout-layout">
        {/* Left Form: Delivery Information & Simulated Payment Choice */}
        <div className="checkout-form-column">
          <form onSubmit={handlePlaceOrder} className="checkout-form">
            {errorMessage && (
              <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                {errorMessage}
              </div>
            )}

            {/* Section 1: Customer Contact & Shipping */}
            <div className="checkout-card">
              <h3 className="section-title">1. Shipping & Contact Information</h3>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="chkName">Full Name *</label>
                  <input
                    id="chkName"
                    type="text"
                    required
                    placeholder="Recipient's Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-text"
                  />
                </div>

                <div className="form-group flex-1">
                  <label htmlFor="chkPhone">Contact Phone *</label>
                  <input
                    id="chkPhone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="chkAddress">Delivery Address Line *</label>
                <input
                  id="chkAddress"
                  type="text"
                  required
                  placeholder="House/Flat No., Building Name, Street"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="input-text"
                />
              </div>

              <div className="form-row-three">
                <div className="form-group">
                  <label htmlFor="chkCity">City *</label>
                  <input
                    id="chkCity"
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-text"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="chkState">State *</label>
                  <input
                    id="chkState"
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-text"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="chkPincode">PIN Code *</label>
                  <input
                    id="chkPincode"
                    type="text"
                    required
                    placeholder="e.g. 411001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="input-text"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Simulated Payment Selection */}
            <div className="checkout-card">
              <h3 className="section-title">2. Select Simulated Payment Option</h3>
              <p className="section-subtitle">
                Choose an academic simulation mode. No bank accounts or payment gateways are accessed.
              </p>

              <div className="payment-options-list">
                {/* Option A: Simulated Online Payment */}
                <label
                  className={`payment-choice-box ${
                    paymentMethod === 'Simulated Online Payment' ? 'active' : ''
                  }`}
                >
                  <div className="payment-radio-row">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Simulated Online Payment"
                      checked={paymentMethod === 'Simulated Online Payment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <strong>Simulated Online Payment (Prepaid)</strong>
                  </div>
                  <p className="payment-choice-desc">
                    Instant mock payment approval for test orders. Generates database order with <em>"Simulated - Completed"</em> payment record.
                  </p>
                </label>

                {/* Option B: Simulated Cash on Delivery */}
                <label
                  className={`payment-choice-box ${
                    paymentMethod === 'Simulated Cash on Delivery' ? 'active' : ''
                  }`}
                >
                  <div className="payment-radio-row">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Simulated Cash on Delivery"
                      checked={paymentMethod === 'Simulated Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <strong>Simulated Cash on Delivery (COD)</strong>
                  </div>
                  <p className="payment-choice-desc">
                    Mock pay upon simulated doorstep courier arrival. Generates database order with <em>"Simulated - COD"</em> record.
                  </p>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-large btn-block"
              style={{ marginTop: '1.5rem' }}
            >
              {submitting
                ? 'Validating & Recording Order...'
                : `Place Simulated Order • ₹${cart.total.toLocaleString('en-IN')}`}
            </button>
          </form>
        </div>

        {/* Right Column: Checkout Order Summary */}
        <div className="checkout-summary-column">
          <div className="order-summary-card">
            <h3 className="summary-title">Items in Order ({cart.items.length})</h3>

            <div className="checkout-items-list">
              {cart.items.map((item) => (
                <div key={item.product._id} className="checkout-item-row">
                  <div className="checkout-item-info">
                    <span className="checkout-item-title">{item.product.name}</span>
                    <span className="checkout-item-qty">
                      Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <strong className="checkout-item-subtotal">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </strong>
                </div>
              ))}
            </div>

            <hr className="divider" />

            <div className="summary-line">
              <span>Items Subtotal:</span>
              <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-line">
              <span>Delivery Charges:</span>
              <span>
                {cart.deliveryFee === 0 ? (
                  <strong style={{ color: 'var(--color-olive-dark)' }}>FREE</strong>
                ) : (
                  `₹${cart.deliveryFee}`
                )}
              </span>
            </div>

            <hr className="divider" />

            <div className="summary-line total-line">
              <span>Grand Total:</span>
              <span className="grand-total-amount">
                ₹{cart.total.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="checkout-back-link">
              <Link to="/cart">← Return to edit cart items</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
