import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-logo-text">TATVA</span>
            <span className="brand-subtext">PURE BY PRINCIPLE</span>
          </div>
          <p className="footer-tagline">
            Dedicated to uncompromising formulation standards, micro-filtered protein, and performance essentials for athletic discipline.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Catalogue</h4>
          <ul className="footer-links">
            <li><Link to="/shop?category=Protein">Whey & Proteins</Link></li>
            <li><Link to="/shop?category=Performance">Creatine & Performance</Link></li>
            <li><Link to="/shop?category=Nutrition">Nutrition & Oats</Link></li>
            <li><Link to="/shop?category=Accessories">Gym Accessories</Link></li>
            <li><Link to="/product-finder">Smart Product Finder</Link></li>
            <li><Link to="/compare">Compare Products</Link></li>
          </ul>
        </div>

        {/* Customer Account Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Account & Orders</h4>
          <ul className="footer-links">
            <li><Link to="/account">My Profile</Link></li>
            <li><Link to="/orders">Order History</Link></li>
            <li><Link to="/wishlist">Saved Wishlist</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/login">Sign In / Register</Link></li>
            <li><Link to="/admin">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Transparency & Disclaimer Column */}
        <div className="footer-col disclaimer-col">
          <h4 className="footer-heading">Academic Notice</h4>
          <p className="disclaimer-text">
            TATVA Nutrition is an academic project prototype developed for CA-03. All nutritional information, supplement claims, prices, and simulated transactions are demonstration data for coursework evaluation and testing.
          </p>
          <p className="disclaimer-text">
            Simulated checkout does not collect payment cards, UPI PINs, or real monetary payments.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} TATVA Nutrition. Pure by Principle. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
