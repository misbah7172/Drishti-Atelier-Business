import './Skeleton.css';

/** Shimmer skeleton block */
export function Skeleton({ width, height, radius = 4, style = {} }) {
  return <div className="skeleton-pulse" style={{ width, height, borderRadius: radius, ...style }} />;
}

/** Product card skeleton */
export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton width="100%" height={220} radius={8} />
      <div style={{ padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton width="60%" height={10} />
        <Skeleton width="85%" height={12} />
        <Skeleton width="40%" height={14} />
      </div>
    </div>
  );
}

/** Product grid skeleton (n cards) */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}

/** Table row skeleton */
export function TableRowSkeleton({ cols = 5, rows = 5 }) {
  return Array.from({ length: rows }).map((_, r) => (
    <tr key={r}>
      {Array.from({ length: cols }).map((_, c) => (
        <td key={c} style={{ padding: '0.7rem 1rem' }}>
          <Skeleton width={c === 0 ? '70%' : '50%'} height={12} />
        </td>
      ))}
    </tr>
  ));
}

/** Page-level loading spinner */
export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-ring" />
      <span className="page-loader-text">Loading...</span>
    </div>
  );
}
