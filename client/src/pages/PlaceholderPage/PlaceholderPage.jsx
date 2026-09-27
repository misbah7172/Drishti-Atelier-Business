import './PlaceholderPage.css';

export default function PlaceholderPage({ title, phase }) {
  return (
    <div className="placeholder-page">
      <div className="container placeholder-content">
        <span className="placeholder-badge badge badge-dark">Phase {phase}</span>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-desc">
          This page will be built in Phase {phase}. Check back soon!
        </p>
      </div>
    </div>
  );
}
