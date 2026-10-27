import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import PriceDisplay from './PriceDisplay';
import RatingDisplay from './RatingDisplay';

export const ProductCard = ({ product, onCompareToggle, isCompared = false }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [adding, setAdding] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || '/images/tatva-whey-isolate.svg');

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stockQuantity < 1;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const res = await addToCart(product._id, 1);
    setAdding(false);

    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    } else if (res.requireAuth) {
      window.location.href = `/login?redirect=/products/${product.slug}`;
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    const res = await toggleWishlist(product);
    if (res.requireAuth) {
      window.location.href = `/login?redirect=/products/${product.slug}`;
    }
  };

  const handleImgError = () => {
    if (imgSrc.endsWith('.png')) {
      setImgSrc(imgSrc.replace('.png', '.svg'));
    } else {
      setImgSrc('/images/tatva-whey-isolate.svg');
    }
  };

  return (
    <div className="product-card">
      {/* Card Visual & Top Badges */}
      <div className="product-card-image-wrap">
        <Link to={`/products/${product.slug}`} className="product-card-image-link">
          <img
            src={imgSrc}
            alt={product.name}
            onError={handleImgError}
            loading="lazy"
            className="product-card-img"
          />
        </Link>

        {/* Category Pill */}
        <span className="badge-category">{product.category}</span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`btn-wishlist-icon ${isWishlisted ? 'active' : ''}`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isWishlisted ? '#E02424' : 'none'} stroke={isWishlisted ? '#E02424' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {/* Low Stock or Out of Stock Badge */}
        {isOutOfStock ? (
          <span className="badge-stock badge-out">Out of Stock</span>
        ) : product.stockQuantity <= 10 ? (
          <span className="badge-stock badge-low">Only {product.stockQuantity} left</span>
        ) : null}
      </div>

      {/* Card Details */}
      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-flavor">
            {product.flavor || product.packSize || 'Pure Formula'}
          </span>
          <RatingDisplay rating={product.rating} numReviews={product.numReviews} />
        </div>

        <h3 className="product-card-title">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className="product-card-price-row">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="medium" />
        </div>

        {/* Card Actions */}
        <div className="product-card-actions">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`btn-add-cart ${addedNotice ? 'btn-added' : ''}`}
          >
            {adding ? 'Adding...' : addedNotice ? '✓ Added to Cart' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>

          {onCompareToggle && (
            <button
              type="button"
              onClick={() => onCompareToggle(product)}
              className={`btn-compare-pill ${isCompared ? 'active' : ''}`}
              title="Compare side-by-side"
            >
              {isCompared ? '✓ Comparing' : '+ Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
