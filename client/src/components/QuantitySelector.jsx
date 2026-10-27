import React from 'react';

/**
 * Reusable QuantitySelector with increment/decrement buttons and stock limits
 */
export const QuantitySelector = ({
  quantity = 1,
  maxStock = 99,
  onChange,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (quantity > 1 && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxStock && !disabled) {
      onChange(quantity + 1);
    }
  };

  return (
    <div
      className="quantity-selector"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        style={{
          width: '36px',
          height: '36px',
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: '1.1rem',
          cursor: quantity <= 1 || disabled ? 'not-allowed' : 'pointer',
          color: quantity <= 1 || disabled ? 'var(--text-muted)' : 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span
        style={{
          width: '40px',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: 'var(--text-color)',
          userSelect: 'none',
        }}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= maxStock}
        style={{
          width: '36px',
          height: '36px',
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: '1.1rem',
          cursor: quantity >= maxStock || disabled ? 'not-allowed' : 'pointer',
          color: quantity >= maxStock || disabled ? 'var(--text-muted)' : 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
