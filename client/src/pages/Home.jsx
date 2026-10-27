import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import { LoadingSpinner, ErrorMessage } from '../components/UIFeedback';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.products.getFeatured();
        if (res.success && res.products) {
          setFeaturedProducts(res.products);
        }
      } catch (err) {
        setError('Could not connect to backend to load featured products.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const categories = [
    {
      title: 'Whey Protein',
      slug: 'Protein',
      desc: 'Micro-filtered whey isolates with clean amino acid profiles.',
      tag: '01',
      color: '#B68D40',
    },
    {
      title: 'Performance',
      slug: 'Performance',
      desc: 'Micronized creatine & high-potency pre-workout blends.',
      tag: '02',
      color: '#4F6D48',
    },
    {
      title: 'Daily Nutrition',
      slug: 'Nutrition',
      desc: 'Slow-roasted peanut butter & high-fiber protein oats.',
      tag: '03',
      color: '#B68D40',
    },
    {
      title: 'Gym Essentials',
      slug: 'Accessories',
      desc: 'BPA-free steel shaker bottles and gym utility.',
      tag: '04',
      color: '#1F2421',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">PREMIUM SPORTS NUTRITION</span>
            <h1 className="hero-title">
              TATVA Nutrition <br />
              <span className="hero-tagline">Pure by Principle.</span>
            </h1>
            <p className="hero-description">
              Engineered with clean, micro-filtered protein isolates and unadulterated performance supplements. Zero deceptive filler blends, zero shortcuts — only disciplined purity.
            </p>

            <div className="hero-actions">
              <Link to="/shop" className="btn-primary btn-large">
                Shop Catalogue →
              </Link>
              <Link to="/product-finder" className="btn-secondary btn-large">
                Smart Product Finder
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <strong>100%</strong>
                <span>Isolate Formulas</span>
              </div>
              <div className="stat-separator" />
              <div className="stat-item">
                <strong>6 Clean</strong>
                <span>Core Catalogue Items</span>
              </div>
              <div className="stat-separator" />
              <div className="stat-item">
                <strong>Zero</strong>
                <span>Artificial Fillers</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="/images/tatva-main-poster.jpg"
              alt="TATVA Nutrition Showcase — Real Nutrition for a Stronger You"
              className="hero-poster-img"
              onError={(e) => {
                e.target.src = '/images/tatva-main-poster.png';
              }}
            />
          </div>
        </div>
      </section>

      {/* Category Shortcuts Section */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subheading">CURATED FORMULATIONS</span>
            <h2 className="section-heading">Explore by Goal & Category</h2>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="category-card"
              >
                <div className="category-tag-num">{cat.tag}</div>
                <h3 className="category-title">{cat.title}</h3>
                <p className="category-desc">{cat.desc}</p>
                <span className="category-link-text">Browse Products →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-featured">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <span className="section-subheading">ATHLETE FAVORITES</span>
              <h2 className="section-heading">Featured Supplements</h2>
            </div>
            <Link to="/shop" className="btn-outline">
              View All Products ({featuredProducts.length || 6}) →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching featured products from local MongoDB..." />
          ) : error ? (
            <ErrorMessage
              message={error}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="section-philosophy">
        <div className="container philosophy-inner">
          <div className="philosophy-text">
            <span className="section-subheading">THE TATVA CODE</span>
            <h2 className="section-heading">Why "Pure by Principle" Defines Everything We Build</h2>
            <p>
              In an industry crowded with proprietary blends and excessive fillers, TATVA was conceived to reset standards. Every scoop delivers exact, transparent, micro-filtered protein and unflavored micronized creatine.
            </p>

            <ul className="philosophy-checklist">
              <li>
                <strong>Transparent Formulations:</strong> Declared values and clear separation of active elements.
              </li>
              <li>
                <strong>Zero Added Hydrogenated Oils:</strong> 100% slow-roasted peanuts in our nutrition spread.
              </li>
              <li>
                <strong>Rigorous Clean Mixing:</strong> Rapid solubility without residual foam or artificial chalkiness.
              </li>
            </ul>

            <Link to="/shop" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
              Explore the Range
            </Link>
          </div>

          <div className="philosophy-card-badge">
            <div className="badge-stamp">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem', display: 'block' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <h3>CERTIFIED FORMULATION</h3>
              <p>Crafted to uncompromising sports nutrition formulation standards.</p>
              <div className="stamp-stats">
                <span>Frontend: React + Vite</span>
                <span>Backend: Node + Express</span>
                <span>Database: MongoDB Compass</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Newsletter Section */}
      <section className="section-newsletter">
        <div className="container newsletter-box">
          <div className="newsletter-text">
            <h3>Stay Updated on Clean Nutrition</h3>
            <p>Subscribe for simulated updates on product drops, training nutrition concepts, and offers.</p>
          </div>

          {newsletterSubscribed ? (
            <div className="newsletter-success">
              ✓ Thank you! You are now subscribed to TATVA prototype updates.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
