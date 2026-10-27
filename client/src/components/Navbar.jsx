import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="site-header">
      {/* Main Navigation Bar */}
      <div className="navbar-container">
        {/* Brand Logo & Tagline */}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo-text">TATVA</span>
          <span className="brand-subtext">PURE BY PRINCIPLE</span>
        </Link>

        {/* Desktop Navigation Links — Only shown once logged in */}
        {isAuthenticated && (
          <nav className="desktop-nav">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Shop
            </NavLink>
            <NavLink to="/product-finder" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Smart Finder
            </NavLink>
            <NavLink to="/compare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Compare
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link nav-admin ${isActive ? 'active' : ''}`}>
                Admin
              </NavLink>
            )}
          </nav>
        )}

        {/* Search Bar — Only shown once logged in */}
        {isAuthenticated && (
          <form onSubmit={handleSearchSubmit} className="nav-search-form">
            <input
              type="search"
              placeholder="Search whey, creatine, oats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
              aria-label="Search catalogue"
            />
            <button type="submit" className="nav-search-btn" aria-label="Submit search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        )}

        {/* Action Icons & User Account */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {/* Wishlist Link with Badge */}
              <Link to="/wishlist" className="nav-action-btn" title="Saved Wishlist" aria-label="Wishlist">
                <span className="action-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </span>
                {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
              </Link>

              {/* Cart Link with Badge */}
              <Link to="/cart" className="nav-action-btn" title="Shopping Cart" aria-label="Shopping Cart">
                <span className="action-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </span>
                {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
              </Link>

              {/* User Profile / Authentication Menu */}
              <div className="user-menu-container">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="user-menu-btn"
                  aria-expanded={userDropdownOpen}
                >
                  <span className="user-avatar-initial">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  <span className="user-greeting-name">{user?.name?.split(' ')[0]}</span>
                  <span className="dropdown-arrow">▾</span>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-header">
                      <strong>{user?.name}</strong>
                      <small>{user?.email}</small>
                      <span className="role-tag">{user?.role}</span>
                    </div>
                    <hr />
                    <Link to="/account" onClick={() => setUserDropdownOpen(false)} className="dropdown-item">
                      My Account
                    </Link>
                    <Link to="/orders" onClick={() => setUserDropdownOpen(false)} className="dropdown-item">
                      Order History
                    </Link>
                    <Link to="/wishlist" onClick={() => setUserDropdownOpen(false)} className="dropdown-item">
                      My Wishlist
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="dropdown-item admin-link">
                        Admin Dashboard
                      </Link>
                    )}
                    <hr />
                    <button type="button" onClick={handleLogout} className="dropdown-item logout-btn">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link to="/login" className="btn-signin-nav">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="search"
              placeholder="Search catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
            <button type="submit" className="nav-search-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop Catalogue</Link>
            <Link to="/product-finder" onClick={() => setMobileMenuOpen(false)}>Smart Product Finder</Link>
            <Link to="/compare" onClick={() => setMobileMenuOpen(false)}>Compare Products</Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart ({cartCount})</Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist ({wishlistCount})</Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>}
                <button type="button" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn-mobile-logout">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-mobile-signin">
                Sign In / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
