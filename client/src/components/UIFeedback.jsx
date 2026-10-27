import React from 'react';

export const LoadingSpinner = ({ message = 'Loading TATVA catalogue...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
      }}
    >
      <div
        className="spinner"
        style={{
          width: '42px',
          height: '42px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--color-olive-dark)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>
        {message}
      </p>
    </div>
  );
};

export const ErrorMessage = ({ message = 'An unexpected error occurred', onRetry }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFF4F2',
        border: '1px solid #FCD3CE',
        borderRadius: '10px',
        padding: '1.5rem',
        margin: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        textAlign: 'center',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C53030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3 style={{ margin: 0, color: '#C53030', fontSize: '1.05rem', fontWeight: 600 }}>
        Action Failed
      </h3>
      <p style={{ margin: 0, color: '#742A2A', fontSize: '0.9rem' }}>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: '0.5rem',
            padding: '6px 16px',
            backgroundColor: '#C53030',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const EmptyState = ({
  icon,
  title = 'No items found',
  description = 'Try adjusting your filters or search query.',
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px dashed var(--border-color)',
        margin: '1.5rem 0',
      }}
    >
      {icon ? (
        <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</span>
      ) : (
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
      )}
      <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)', fontSize: '1.25rem' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.95rem' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default { LoadingSpinner, ErrorMessage, EmptyState };
