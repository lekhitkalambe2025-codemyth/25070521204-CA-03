import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Account = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '');
  const [state, setState] = useState(user?.addresses?.[0]?.state || '');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '');

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const addresses = [
      {
        street: addressLine,
        city,
        state,
        postalCode,
        isDefault: true,
      },
    ];

    const res = await updateProfile({ phone, addresses });
    setSaving(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Profile & default shipping address updated!' });
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to update profile' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="account-page container">
      {/* Header */}
      <div className="account-header">
        <div>
          <span className="section-subheading">CUSTOMER PROFILE</span>
          <h1 className="page-title">My Account</h1>
          <p className="page-subtitle">Manage personal information, default shipping, and orders</p>
        </div>

        <button type="button" onClick={handleLogout} className="btn-outline btn-logout">
          Sign Out
        </button>
      </div>

      {/* Grid: Profile summary card + Address editor */}
      <div className="account-grid">
        {/* Left Card: Customer Overview */}
        <div className="account-card profile-card">
          <div className="profile-avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h3 className="profile-name">{user?.name}</h3>
          <p className="profile-email">{user?.email}</p>
          <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-customer'}`}>
            Role: {user?.role ? user.role.toUpperCase() : 'CUSTOMER'}
          </span>

          <hr className="divider" />

          {/* Quick Metrics */}
          <div className="account-quick-stats">
            <Link to="/orders" className="stat-card-link">
              <span className="stat-number">Orders</span>
              <span className="stat-label">View My Orders</span>
            </Link>

            <Link to="/wishlist" className="stat-card-link">
              <span className="stat-number">{wishlistCount}</span>
              <span className="stat-label">Saved Items</span>
            </Link>

            <Link to="/cart" className="stat-card-link">
              <span className="stat-number">{cartCount}</span>
              <span className="stat-label">Cart Items</span>
            </Link>
          </div>

          {isAdmin && (
            <div className="admin-portal-box">
              <h4>Administrator Controls</h4>
              <p>You have staff privileges to oversee products, stock, and orders.</p>
              <Link to="/admin" className="btn-primary btn-block">
                Go to Admin Dashboard →
              </Link>
            </div>
          )}
        </div>

        {/* Right Card: Shipping Address & Details Form */}
        <div className="account-card shipping-card">
          <h3>Default Shipping Address</h3>
          <p className="card-sub-desc">
            Save your delivery details for seamless auto-filling during simulated checkout.
          </p>

          {statusMessage && (
            <div
              className={`alert ${
                statusMessage.type === 'success' ? 'alert-success' : 'alert-error'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="address-form">
            <div className="form-group">
              <label htmlFor="phone">Contact Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-text"
              />
            </div>

            <div className="form-group">
              <label htmlFor="street">Street Address / Apartment / Flat</label>
              <input
                id="street"
                type="text"
                placeholder="Flat 402, High-Performance Towers, MG Road"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="input-text"
                required
              />
            </div>

            <div className="form-row-three">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Pune / Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-text"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="input-text"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Postal / PIN Code</label>
                <input
                  id="pincode"
                  type="text"
                  placeholder="e.g. 411001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="input-text"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              {saving ? 'Saving Details...' : 'Save Default Address'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
