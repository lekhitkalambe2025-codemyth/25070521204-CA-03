import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import RatingDisplay from '../components/RatingDisplay';
import { EmptyState, LoadingSpinner } from '../components/UIFeedback';

export const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    const res = await addToCart(product._id, 1);
    if (res.success) {
      removeFromWishlist(product._id);
    }
  };

  return (
    <div className="wishlist-page container">
      <div className="page-header">
        <span className="section-subheading">SAVED SUPPLEMENTS</span>
        <h1 className="page-title">My Wishlist</h1>
        <p className="page-subtitle">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your private MongoDB collection
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your saved supplements..." />
      ) : wishlist.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save supplements while browsing so you can easily compare and purchase them later."
          actionText="Browse Catalogue →"
          onAction={() => (window.location.href = '/shop')}
        />
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => {
            if (!product) return null;
            const isOutOfStock = product.stockQuantity < 1;

            return (
              <div key={product._id} className="product-card wishlist-card">
                <div className="product-card-image-wrap">
                  <Link to={`/products/${product.slug}`} className="product-card-image-link">
                    <img
                      src={product.image || '/images/tatva-whey-isolate.svg'}
                      alt={product.name}
                      className="product-card-img"
                      onError={(e) => {
                        e.target.src = '/images/tatva-whey-isolate.svg';
                      }}
                    />
                  </Link>
                  <span className="badge-category">{product.category}</span>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product._id)}
                    className="btn-wishlist-remove"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>

                <div className="product-card-body">
                  <div className="product-card-meta">
                    <span className="product-flavor">{product.flavor || product.packSize}</span>
                    <RatingDisplay rating={product.rating} numReviews={product.numReviews} />
                  </div>

                  <h3 className="product-card-title">
                    <Link to={`/products/${product.slug}`}>{product.name}</Link>
                  </h3>

                  <div className="product-card-price-row">
                    <PriceDisplay
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      size="medium"
                    />
                  </div>

                  <div className="product-card-actions">
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(product)}
                      disabled={isOutOfStock}
                      className="btn-primary btn-block btn-sm"
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Move to Cart →'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
