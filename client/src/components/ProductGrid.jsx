import React from 'react';
import ProductCard from './ProductCard';
import { EmptyState } from './UIFeedback';

export const ProductGrid = ({
  products = [],
  loading = false,
  onCompareToggle,
  comparedIds = [],
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search criteria or filter options.',
}) => {
  if (loading) {
    return (
      <div className="product-grid skeleton-grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="product-card skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-line title" />
            <div className="skeleton-line meta" />
            <div className="skeleton-line price" />
            <div className="skeleton-button" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onCompareToggle={onCompareToggle}
          isCompared={comparedIds.includes(product._id || product.slug)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
