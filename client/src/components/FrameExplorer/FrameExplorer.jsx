import { useState } from 'react';
import './FrameExplorer.css';

const angles = [
  {
    id: 'front',
    label: 'Front Symmetry',
    image: '/images/hero-glasses.png',
    caption: 'Symmetrical optical balance with dual caustics.',
  },
  {
    id: 'profile45',
    label: '45° Silhouette',
    image: '/images/blue-aviator.png',
    caption: 'Three-quarter depth showing brow arch & lens bevel.',
  },
  {
    id: 'temple',
    label: 'Side Architecture',
    image: '/images/amber-aviator.png',
    caption: 'Five-barrel monobloc hinge and tapered earstems.',
  },
  {
    id: 'lifestyle',
    label: 'Worn On Face',
    image: '/images/lifestyle-model.png',
    caption: 'Natural human proportions in ambient street light.',
  },
];

const dimensions = [
  { label: 'LENS WIDTH', value: '51 MM' },
  { label: 'BRIDGE WIDTH', value: '19 MM' },
  { label: 'TEMPLE LENGTH', value: '145 MM' },
  { label: 'FRAME WEIGHT', value: '18.4 G' },
];

export default function FrameExplorer() {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const activeAngle = angles[activeAngleIndex];

  return (
    <section className="explorer-section" id="explorer-section">
      <div className="container-editorial">
        <div className="explorer-header">
          <span className="editorial-eyebrow">Interactive Geometry</span>
          <h2 className="editorial-section-title">
            EXPLORE FROM <br />
            <span className="text-muted-editorial">EVERY PERSPECTIVE.</span>
          </h2>
          <p className="editorial-body">
            Examine how structural balance and light interact across four curated
            angles of the signature Drishti Atelier frame.
          </p>
        </div>

        {/* Perspective Switcher Controls */}
        <div className="explorer-controls" role="tablist">
          {angles.map((ang, idx) => (
            <button
              key={ang.id}
              type="button"
              role="tab"
              aria-selected={activeAngleIndex === idx}
              className={`explorer-pill-btn ${activeAngleIndex === idx ? 'pill-active' : ''}`}
              onClick={() => setActiveAngleIndex(idx)}
            >
              <span className="pill-index">0{idx + 1}</span>
              <span className="pill-label">{ang.label}</span>
            </button>
          ))}
        </div>

        {/* Visual Frame & Specs Grid */}
        <div className="explorer-stage-grid">
          <div className="explorer-canvas">
            <img
              src={activeAngle.image}
              alt={activeAngle.label}
              className="explorer-image"
              key={activeAngle.id}
            />
            <div className="explorer-caption-bar">
              <span className="explorer-caption-text">{activeAngle.caption}</span>
              <span className="explorer-scale-indicator">1:1 Macro Calibration</span>
            </div>
          </div>

          {/* Blueprint Dimensions Sidebar */}
          <div className="explorer-specs-card">
            <h3 className="specs-card-title">ARCHITECTURAL METRICS</h3>
            <p className="specs-card-sub">
              Calibrated to standard optical ergonomics for all-day comfort.
            </p>

            <div className="specs-metrics-list">
              {dimensions.map((dim) => (
                <div key={dim.label} className="metric-row">
                  <span className="metric-name">{dim.label}</span>
                  <span className="metric-dots" aria-hidden="true" />
                  <span className="metric-val">{dim.value}</span>
                </div>
              ))}
            </div>

            <div className="specs-footer-note">
              <span className="badge-titanium">Grade-5 Titanium</span>
              <span className="badge-titanium">Universal Nose Bridge</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
