const LoadingSkeleton = ({ type = 'card', count = 6 }) => {
  if (type === 'card') {
    return (
      <div className="content-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="skeleton" style={{ height: 160 }}></div>
            <div style={{ padding: 'var(--space-lg)' }}>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="stats-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton skeleton-card" style={{ height: 100 }}></div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton skeleton-text" style={{ height: 44, marginBottom: 4 }}></div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
