import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import RatingDisplay from '../components/RatingDisplay';
import { LoadingSpinner, EmptyState } from '../components/UIFeedback';

export const ProductFinder = () => {
  const { addToCart } = useCart();

  const [category, setCategory] = useState('All');
  const [maxBudget, setMaxBudget] = useState(2500);
  const [dietType, setDietType] = useState('Any');
  const [flavor, setFlavor] = useState('Any');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disclaimer, setDisclaimer] = useState('');
  const [addedIds, setAddedIds] = useState([]);

  const executeSearch = async () => {
    try {
      setLoading(true);
      const params = {
        category: category !== 'All' ? category : undefined,
        maxBudget,
        dietType: dietType !== 'Any' ? dietType : undefined,
        flavor: flavor !== 'Any' ? flavor : undefined,
      };

      const res = await api.finder.find(params);
      if (res.success && res.recommendations) {
        setResults(res.recommendations);
        setDisclaimer(res.disclaimer);
      }
    } catch (err) {
      console.warn('Error fetching recommendations:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [category, maxBudget, dietType, flavor]);

  const handleAddToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res.success) {
      setAddedIds((prev) => [...prev, product._id]);
      setTimeout(() => {
        setAddedIds((prev) => prev.filter((id) => id !== product._id));
      }, 2000);
    }
  };

  return (
    <div className="finder-page container">
      {/* Header */}
      <div className="page-header text-center">
        <span className="section-subheading">RULE-BASED PRODUCT DISCOVERY</span>
        <h1 className="page-title">Smart Supplement Finder</h1>
        <p className="page-subtitle">
          Configure your training preferences and budget to discover exact matched formulas from the TATVA catalogue.
        </p>
      </div>

      {/* Interactive Criteria Box */}
      <div className="finder-criteria-card">
        <div className="criteria-grid">
          {/* 1. Category */}
          <div className="criteria-item">
            <label className="criteria-label">1. Primary Target Goal / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-custom"
            >
              <option value="All">All Categories (Comprehensive)</option>
              <option value="Protein">Muscle Recovery (Protein)</option>
              <option value="Performance">Strength & Focus (Performance)</option>
              <option value="Nutrition">Daily Sustained Energy (Nutrition)</option>
              <option value="Accessories">Training Essentials (Accessories)</option>
            </select>
          </div>

          {/* 2. Budget Slider */}
          <div className="criteria-item">
            <div className="flex-between">
              <label className="criteria-label">2. Maximum Budget Limit</label>
              <strong className="budget-value">₹{maxBudget.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              min="299"
              max="3000"
              step="50"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="slider-range"
            />
            <div className="slider-labels flex-between">
              <small>₹299</small>
              <small>₹3,000</small>
            </div>
          </div>

          {/* 3. Dietary Preference */}
          <div className="criteria-item">
            <label className="criteria-label">3. Dietary Preference</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="select-custom"
            >
              <option value="Any">Any Dietary Preference</option>
              <option value="Vegetarian">Vegetarian Friendly</option>
              <option value="Vegan">100% Plant-Based / Vegan</option>
            </select>
          </div>

          {/* 4. Flavor Profile */}
          <div className="criteria-item">
            <label className="criteria-label">4. Flavor Preference</label>
            <select
              value={flavor}
              onChange={(e) => setFlavor(e.target.value)}
              className="select-custom"
            >
              <option value="Any">Any Flavor / Unflavored</option>
              <option value="Chocolate">Rich Chocolate Notes</option>
              <option value="Fruit Punch">Fruit Punch / Tangy</option>
              <option value="Unflavored">Pure Unflavored (Zero sweet)</option>
              <option value="Creamy">Creamy Peanut Nutty</option>
            </select>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="finder-disclaimer">
          <strong>Deterministic Matching Disclaimer:</strong> {disclaimer || 'Rule-based matching uses deterministic catalogue attributes and does not provide clinical or medical recommendations.'}
        </div>
      </div>

      {/* Results Section */}
      <div className="finder-results-section">
        <div className="results-header flex-between">
          <h3>
            Matching Recommendations ({results.length})
          </h3>
          <span className="results-badge">Sorted by Match Score</span>
        </div>

        {loading ? (
          <LoadingSpinner message="Filtering and scoring catalogue formulas..." />
        ) : results.length === 0 ? (
          <EmptyState
            title="No supplements matched all criteria"
            description="Try increasing your maximum budget limit or selecting 'All' categories."
          />
        ) : (
          <div className="finder-results-grid">
            {results.map(({ product, matchReasons, score }) => {
              const isAdded = addedIds.includes(product._id);
              return (
                <div key={product._id} className="finder-result-card">
                  <div className="result-card-media">
                    <img
                      src={product.image || '/images/tatva-whey-isolate.svg'}
                      alt={product.name}
                      className="result-img"
                      onError={(e) => {
                        e.target.src = '/images/tatva-whey-isolate.svg';
                      }}
                    />
                    <span className="score-pill">Match Score: {score}</span>
                  </div>

                  <div className="result-card-content">
                    <div className="result-header-row">
                      <span className="badge-category">{product.category}</span>
                      <RatingDisplay rating={product.rating} numReviews={product.numReviews} />
                    </div>

                    <h4 className="result-title">
                      <Link to={`/products/${product.slug}`}>{product.name}</Link>
                    </h4>

                    <div className="result-price-wrap">
                      <PriceDisplay
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        size="medium"
                      />
                    </div>

                    {/* Transparent Match Reasons List */}
                    <div className="match-reasons-box">
                      <span className="reasons-heading">Why this matches your criteria:</span>
                      <ul className="reasons-list">
                        {matchReasons.map((reason, i) => (
                          <li key={i}>✓ {reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="result-actions flex-between">
                      <Link to={`/products/${product.slug}`} className="btn-outline btn-sm">
                        View Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity < 1}
                        className={`btn-primary btn-sm ${isAdded ? 'btn-added' : ''}`}
                      >
                        {isAdded ? '✓ Added' : product.stockQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFinder;
