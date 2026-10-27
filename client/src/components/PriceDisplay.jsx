import React from 'react';

/**
 * Reusable PriceDisplay component showing formatted INR price, compareAtPrice strike-through, and discount percentage
 */
export const PriceDisplay = ({ price, compareAtPrice, size = 'medium' }) => {
  const numericPrice = Number(price) || 0;
  const numericCompare = Number(compareAtPrice);
  const hasDiscount = numericCompare > numericPrice;
  const discountPercent = hasDiscount
    ? Math.round(((numericCompare - numericPrice) / numericCompare) * 100)
    : 0;

  const fontSizes = {
    small: { price: '1rem', compare: '0.8rem', badge: '0.7rem' },
    medium: { price: '1.25rem', compare: '0.9rem', badge: '0.75rem' },
    large: { price: '1.75rem', compare: '1.1rem', badge: '0.85rem' },
  };

  const style = fontSizes[size] || fontSizes.medium;

  return (
    <div className="price-display" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span
        style={{
          fontSize: style.price,
          fontWeight: 700,
          color: 'var(--text-color)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        ₹{numericPrice.toLocaleString('en-IN')}
      </span>

      {hasDiscount && (
        <>
          <span
            style={{
              fontSize: style.compare,
              color: 'var(--text-muted)',
              textDecoration: 'line-through',
            }}
          >
            ₹{numericCompare.toLocaleString('en-IN')}
          </span>
          <span
            style={{
              fontSize: style.badge,
              fontWeight: 600,
              color: 'var(--color-olive-dark)',
              backgroundColor: 'var(--color-olive-light)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {discountPercent}% OFF
          </span>
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
