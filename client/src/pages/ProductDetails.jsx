import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import PriceDisplay from '../components/PriceDisplay';
import RatingDisplay from '../components/RatingDisplay';
import QuantitySelector from '../components/QuantitySelector';
import { LoadingSpinner, ErrorMessage } from '../components/UIFeedback';

export const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery state
  const [activeImage, setActiveImage] = useState('');

  // Cart / Order interaction state
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState('overview');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  // Related products
  const [relatedProducts, setRelatedProducts] = useState([]);

  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.products.getBySlug(slug);

      if (res.success && res.product) {
        setProduct(res.product);
        setActiveImage(res.product.image || '/images/tatva-whey-isolate.svg');
        setQuantity(1);

        // Fetch reviews for this product
        fetchReviews(res.product._id);

        // Fetch related products from same category
        api.products
          .getAll({ category: res.product.category, limit: 4 })
          .then((relRes) => {
            if (relRes.success && relRes.products) {
              setRelatedProducts(
                relRes.products.filter((p) => p._id !== res.product._id)
              );
            }
          })
          .catch(() => {});
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchReviews = async (productId) => {
    try {
      setReviewsLoading(true);
      const res = await api.reviews.getByProduct(productId);
      if (res.success && res.reviews) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.warn('Could not load reviews:', err.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleAddToCart = async () => {
    if (!product || product.stockQuantity < 1) return;

    setAddingToCart(true);
    const res = await addToCart(product._id, quantity);
    setAddingToCart(false);

    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    } else if (res.requireAuth) {
      navigate(`/login?redirect=/products/${product.slug}`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${product.slug}`);
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewMessage(null);

      const res = await api.reviews.create(product._id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.success) {
        setReviewMessage({ type: 'success', text: 'Review published successfully!' });
        setReviewTitle('');
        setReviewComment('');
        fetchReviews(product._id);
        // Refresh product to update average rating and review count
        api.products.getBySlug(slug).then((updatedRes) => {
          if (updatedRes.success) setProduct(updatedRes.product);
        });
      }
    } catch (err) {
      setReviewMessage({ type: 'error', text: err.message || 'Failed to submit review' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1rem' }}>
        <LoadingSpinner message="Loading product information..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '5rem 1rem' }}>
        <ErrorMessage
          message={error || 'Product not found'}
          onRetry={fetchProductData}
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/shop" className="btn-primary">
            ← Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stockQuantity < 1;

  const handleImageError = () => {
    if (activeImage.endsWith('.png')) {
      setActiveImage(activeImage.replace('.png', '.svg'));
    } else {
      setActiveImage('/images/tatva-whey-isolate.svg');
    }
  };

  return (
    <div className="product-details-page container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="product-detail-hero">
        {/* Gallery / Visual Column */}
        <div className="product-gallery">
          <div className="gallery-main-frame">
            <img
              src={activeImage}
              alt={product.name}
              onError={handleImageError}
              className="gallery-main-img"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="gallery-thumbnails">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} onError={handleImageError} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column */}
        <div className="product-info-column">
          <div className="product-header-badges">
            <span className="badge-category">{product.category}</span>
            {isOutOfStock ? (
              <span className="badge-stock badge-out">Out of Stock</span>
            ) : product.stockQuantity <= 10 ? (
              <span className="badge-stock badge-low">Only {product.stockQuantity} Remaining</span>
            ) : (
              <span className="badge-stock badge-in">✓ In Stock ({product.stockQuantity} available)</span>
            )}
          </div>

          <h1 className="product-headline">{product.name}</h1>

          {/* Ratings & SKU row */}
          <div className="product-sub-meta">
            <RatingDisplay rating={product.rating} numReviews={product.numReviews} />
            <span className="sku-text">SKU: {product.sku || 'TATVA-001'}</span>
          </div>

          {/* Price display */}
          <div className="product-price-box">
            <PriceDisplay
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size="large"
            />
            <span className="tax-inclusive-tag">Inclusive of simulated taxes</span>
          </div>

          {/* Flavor & Pack Size Spec Chips */}
          <div className="product-variant-chips">
            {product.flavor && (
              <div className="variant-chip">
                <span className="chip-label">Flavor:</span>
                <strong>{product.flavor}</strong>
              </div>
            )}
            {product.packSize && (
              <div className="variant-chip">
                <span className="chip-label">Pack Size / Capacity:</span>
                <strong>{product.packSize}</strong>
              </div>
            )}
          </div>

          {/* Short Description */}
          <p className="product-brief-desc">{product.description}</p>

          <hr className="divider" />

          {/* Quantity and Purchase Actions */}
          <div className="purchase-action-panel">
            <div className="quantity-row">
              <label htmlFor="qty">Select Quantity:</label>
              <QuantitySelector
                quantity={quantity}
                maxStock={product.stockQuantity}
                onChange={setQuantity}
                disabled={isOutOfStock}
              />
            </div>

            <div className="action-buttons-group">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className={`btn-primary btn-large btn-add-main ${addedNotice ? 'btn-added' : ''}`}
              >
                {addingToCart
                  ? 'Adding to Cart...'
                  : addedNotice
                  ? '✓ Item Added to Cart'
                  : isOutOfStock
                  ? 'Out of Stock'
                  : `Add to Cart • ₹${(product.price * quantity).toLocaleString('en-IN')}`}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`btn-wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? '#E02424' : 'none'} stroke={isWishlisted ? '#E02424' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{isWishlisted ? 'In Wishlist' : 'Save to Wishlist'}</span>
              </button>
            </div>

            {/* Quick compare link */}
            <div className="compare-shortcut-link">
              <Link to={`/compare?ids=${product._id}`}>
                Compare this product side-by-side with other items →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Overview, Sample Nutrition, Reviews */}
      <section className="product-tabs-section">
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Product Overview
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            Sample Nutrition & Attributes
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        <div className="tab-body">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <h3>Pure Formulation Standards</h3>
              <p>{product.description}</p>
              <h4>Key Specification Highlights</h4>
              <ul className="spec-bullet-list">
                <li>Micro-filtered manufacturing process ensures rapid protein digestion and solubility.</li>
                <li>Zero added refined sugars, artificial fillers, or banned synthetic performance aids.</li>
                <li>Batch verified for academic demonstration and catalogue prototype consistency.</li>
              </ul>
            </div>
          )}

          {/* Tab 2: Sample Nutrition */}
          {activeTab === 'nutrition' && (
            <div className="tab-pane">
              <div className="nutrition-disclaimer-banner">
                ℹ️ <strong>Academic Prototype Notice:</strong> The values below represent sample demonstration data for software evaluation purposes. They do not represent certified clinical or laboratory tested nutrition facts.
              </div>

              <div className="nutrition-table-wrap">
                <table className="nutrition-table">
                  <thead>
                    <tr>
                      <th>Nutrient Field</th>
                      <th>Demonstration Value</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Serving Size</td>
                      <td><strong>{product.sampleNutrition?.servingSize || 'Sample: 30g'}</strong></td>
                      <td>Illustrative standard scoop</td>
                    </tr>
                    <tr>
                      <td>Protein Content</td>
                      <td><strong>{product.sampleNutrition?.protein || 'Sample: 25g'}</strong></td>
                      <td>High-yield micro-filtered</td>
                    </tr>
                    <tr>
                      <td>Carbohydrates</td>
                      <td>{product.sampleNutrition?.carbs || 'Sample: 2g'}</td>
                      <td>Low glycemic index</td>
                    </tr>
                    <tr>
                      <td>Fats</td>
                      <td>{product.sampleNutrition?.fats || 'Sample: 1g'}</td>
                      <td>Zero trans-fats</td>
                    </tr>
                    <tr>
                      <td>Energy / Calories</td>
                      <td>{product.sampleNutrition?.calories || 'Sample: 120 kcal'}</td>
                      <td>Clean metabolic fuel</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="tab-pane">
              <div className="reviews-summary-bar">
                <div>
                  <h3 style={{ margin: 0 }}>Community Feedback</h3>
                  <RatingDisplay rating={product.rating} numReviews={product.numReviews} />
                </div>
              </div>

              {/* Add Review Form */}
              <div className="add-review-card">
                <h4>Write a Review for {product.name}</h4>
                {reviewMessage && (
                  <div
                    className={
                      reviewMessage.type === 'success'
                        ? 'alert alert-success'
                        : 'alert alert-error'
                    }
                  >
                    {reviewMessage.text}
                  </div>
                )}

                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="form-group">
                      <label htmlFor="ratingSelect">Your Rating (1 to 5 Stars):</label>
                      <select
                        id="ratingSelect"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="select-custom"
                      >
                        <option value="5">★★★★★ — 5 Stars (Exceptional)</option>
                        <option value="4">★★★★☆ — 4 Stars (Very Good)</option>
                        <option value="3">★★★☆☆ — 3 Stars (Satisfactory)</option>
                        <option value="2">★★☆☆☆ — 2 Stars (Needs Improvement)</option>
                        <option value="1">★☆☆☆☆ — 1 Star (Disappointed)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reviewTitle">Review Title / Headline:</label>
                      <input
                        id="reviewTitle"
                        type="text"
                        placeholder="e.g. Clean mixability and delicious taste"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="input-text"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="reviewComment">Detailed Review:</label>
                      <textarea
                        id="reviewComment"
                        rows="4"
                        required
                        placeholder="Share your experience with mixability, taste, recovery, and overall quality..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="input-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-primary"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className="review-auth-prompt">
                    <p>You must be signed in to submit a verified product review.</p>
                    <Link to={`/login?redirect=/products/${product.slug}`} className="btn-secondary btn-sm">
                      Sign In to Review
                    </Link>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="reviews-list">
                {reviewsLoading ? (
                  <LoadingSpinner message="Fetching customer reviews..." />
                ) : reviews.length === 0 ? (
                  <p className="no-reviews-note">
                    No community reviews yet. Be the first to share your thoughts on this formula!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id} className="review-card">
                      <div className="review-header">
                        <div>
                          <strong>{rev.userName}</strong>
                          <RatingDisplay rating={rev.rating} showCount={false} />
                        </div>
                        <span className="review-date">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {rev.title && <h5 className="review-title">{rev.title}</h5>}
                      <p className="review-comment">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="section-header">
            <span className="section-subheading">SIMILAR FORMULAS</span>
            <h2 className="section-heading">You May Also Consider</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map((rel) => (
              <div key={rel._id} className="product-card">
                <Link to={`/products/${rel.slug}`} className="product-card-image-link">
                  <img src={rel.image} alt={rel.name} className="product-card-img" />
                </Link>
                <div className="product-card-body">
                  <h4 className="product-card-title">
                    <Link to={`/products/${rel.slug}`}>{rel.name}</Link>
                  </h4>
                  <PriceDisplay price={rel.price} compareAtPrice={rel.compareAtPrice} size="small" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
