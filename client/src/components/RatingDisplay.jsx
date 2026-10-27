import React from 'react';

/**
 * RatingDisplay shows solid star icons, rating value, and review count
 */
export const RatingDisplay = ({ rating = 0, numReviews, showCount = true }) => {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(numericRating);
  const hasHalf = numericRating % 1 >= 0.5;

  return (
    <div
      className="rating-display"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
    >
      <div style={{ color: 'var(--color-bronze)', display: 'inline-flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <span key={i} style={{ color: '#B68D40' }}>★</span>;
          }
          if (i === fullStars && hasHalf) {
            return <span key={i} style={{ color: '#B68D40' }}>★</span>;
          }
          return <span key={i} style={{ color: '#D4CEBF' }}>★</span>;
        })}
      </div>

      <span style={{ fontWeight: 600, color: 'var(--text-color)', marginLeft: '2px' }}>
        {numericRating.toFixed(1)}
      </span>

      {showCount && numReviews !== undefined && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
