import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineSparkles, HiCheck } from 'react-icons/hi2';
import './EyeglassesShapeGuide.css';

const FACE_SHAPES = [
  { id: 'all', label: 'All Shapes', recommendation: 'Explore all signature Drishti optical frame architectures.' },
  { id: 'round', label: 'Round Face', recommendation: 'Recommended: Angular frames (Rectangle & Geometric) add definition and structure.' },
  { id: 'oval', label: 'Oval Face', recommendation: 'Recommended: Most shapes fit naturally (Aviator, Rectangle, Geometric) preserving balanced proportions.' },
  { id: 'square', label: 'Square Face', recommendation: 'Recommended: Curved silhouettes (Round & Aviator) soften strong jawlines and angular features.' },
  { id: 'heart', label: 'Heart Face', recommendation: 'Recommended: Frames that balance brow width (Aviator, Round & Cat Eye) complement tapered chins.' },
  { id: 'diamond', label: 'Diamond Face', recommendation: 'Recommended: Upswept or faceted silhouettes (Cat Eye & Geometric) accentuate high cheekbones.' },
];

const SHAPE_ITEMS = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    shapeParam: 'Rectangle',
    badge: 'Structured & Sharp',
    bestFor: ['round', 'oval'],
    faceText: 'Round & Oval Faces',
    description:
      'Clean horizontal lines and parallel architecture add angular definition to softer facial contours, offering an authoritative presence.',
    specs: '50mm Lens • 19mm Bridge • Grade-5 Titanium',
    link: '/shop?shape=Rectangle',
    svgType: 'rectangle',
  },
  {
    id: 'round',
    name: 'Round',
    shapeParam: 'Round',
    badge: 'Artisanal & Poised',
    bestFor: ['square', 'heart'],
    faceText: 'Square & Heart Faces',
    description:
      'Curved circular titanium rims with keyhole bridge counterbalance sharp jawlines and prominent cheekbones with intellectual warmth.',
    specs: '49mm Lens • 20mm Bridge • Beta Titanium',
    link: '/shop?shape=Round',
    svgType: 'round',
  },
  {
    id: 'aviator',
    name: 'Aviator',
    shapeParam: 'Aviator',
    badge: 'Architectural Icon',
    bestFor: ['oval', 'heart'],
    faceText: 'Oval & Heart Faces',
    description:
      'Iconic teardrop geometry with an elevated brow bar for torsional rigidity. Balances forehead breadth with subtle tapered cheek lines.',
    specs: '51mm Lens • 19mm Bridge • Dual Caustics',
    link: '/shop?shape=Aviator',
    svgType: 'aviator',
  },
  {
    id: 'cat-eye',
    name: 'Cat Eye',
    shapeParam: 'Statement',
    badge: 'Sculptural Lift',
    bestFor: ['diamond', 'heart'],
    faceText: 'Diamond & Heart Faces',
    description:
      'Graceful upswept outer corners naturally lift the eye line and mirror prominent cheekbones for a dramatic editorial silhouette.',
    specs: '52mm Lens • 17mm Bridge • Hand-Buffed Acetate',
    link: '/shop?shape=Statement',
    svgType: 'cat-eye',
  },
  {
    id: 'geometric',
    name: 'Geometric',
    shapeParam: 'Statement',
    badge: 'Avant-Garde Facets',
    bestFor: ['round', 'oval', 'diamond'],
    faceText: 'Round, Oval & Diamond',
    description:
      'Faceted polygonal angles break predictable symmetry, catching ambient studio reflections with contemporary engineering poise.',
    specs: '50mm Lens • 18mm Bridge • Cold-Rolled Metal',
    link: '/shop?shape=Statement',
    svgType: 'geometric',
  },
  {
    id: 'rimless',
    name: 'Rimless Minimal',
    shapeParam: 'all',
    badge: 'Weightless Clarity',
    bestFor: ['round', 'oval', 'square', 'heart', 'diamond'],
    faceText: 'Universal — All Faces',
    description:
      'Stripped of outer rims, this 12-gram pure titanium chassis disappears on the face while offering an unobstructed 180° field of vision.',
    specs: '12.0g Weight • Compression Mountings',
    link: '/shop?category=prescription-glasses',
    svgType: 'rimless',
  },
];

export default function EyeglassesShapeGuide() {
  const [selectedFace, setSelectedFace] = useState('all');

  const currentFaceObj = FACE_SHAPES.find((f) => f.id === selectedFace) || FACE_SHAPES[0];

  return (
    <section className="shape-guide-section" id="shape-guide">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="shape-guide-header">
          <div className="shape-guide-intro">
            <span className="editorial-eyebrow">FRAME ANATOMY & FACIAL PROPORTIONS</span>
            <h2 className="editorial-section-title shape-guide-title">
              GET THE PERFECT SHAPE — EYEGLASSES
            </h2>
            <p className="editorial-body shape-guide-desc">
              Selecting the right frame geometry enhances natural facial symmetry.
              Explore our signature silhouettes sculpted in pure titanium and
              hand-polished acetate to find your ideal visual match.
            </p>
          </div>

          <div className="shape-guide-badge-box">
            <HiOutlineSparkles size={18} className="shape-sparkle-icon" />
            <span className="shape-badge-text">Optical Silhouette Advisor</span>
          </div>
        </div>

        {/* Interactive Face-Shape Selector Filter */}
        <div className="face-selector-wrapper">
          <div className="face-selector-label-row">
            <span className="face-selector-heading">Select Your Facial Structure:</span>
            <span className="face-selector-active-tip">{currentFaceObj.recommendation}</span>
          </div>

          <div className="face-selector-pills" role="tablist" aria-label="Face Shape Filter">
            {FACE_SHAPES.map((face) => (
              <button
                key={face.id}
                type="button"
                role="tab"
                aria-selected={selectedFace === face.id}
                onClick={() => setSelectedFace(face.id)}
                className={`face-selector-btn ${selectedFace === face.id ? 'active' : ''}`}
              >
                <span>{face.label}</span>
                {selectedFace === face.id && <span className="active-dot" />}
              </button>
            ))}
          </div>
        </div>

        {/* Shapes Grid */}
        <div className="shapes-grid">
          {SHAPE_ITEMS.map((item) => {
            const isRecommended =
              selectedFace !== 'all' && item.bestFor.includes(selectedFace);

            return (
              <article
                key={item.id}
                className={`shape-card ${isRecommended ? 'recommended-match' : ''}`}
                id={`shape-card-${item.id}`}
              >
                {/* Card Top Pill & Recommended Tag */}
                <div className="shape-card-top-bar">
                  <span className="shape-card-badge">{item.badge}</span>
                  {isRecommended && (
                    <span className="shape-match-indicator">
                      <HiCheck size={13} />
                      <span>Ideal Match</span>
                    </span>
                  )}
                </div>

                {/* SVG Frame Silhouette Drawing */}
                <div className="shape-blueprint-stage" aria-hidden="true">
                  <ShapeWireframeSvg type={item.svgType} />
                </div>

                {/* Card Info */}
                <div className="shape-card-info">
                  <h3 className="shape-card-name">{item.name}</h3>

                  <div className="shape-face-fit-row">
                    <span className="face-fit-label">Best Suited For:</span>
                    <span className="face-fit-value">{item.faceText}</span>
                  </div>

                  <p className="shape-card-desc">{item.description}</p>

                  <div className="shape-specs-row">
                    <span className="shape-specs-text">{item.specs}</span>
                  </div>

                  <Link
                    to={item.link}
                    className="shape-card-cta"
                    id={`btn-shape-${item.id}`}
                  >
                    <span className="shape-cta-full">Browse {item.name}</span>
                    <span className="shape-cta-short">Browse</span>
                    <HiArrowRight size={13} className="cta-arrow" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Precision SVG Architectural Wireframes for Eyeglasses Shapes
function ShapeWireframeSvg({ type }) {
  if (type === 'rectangle') {
    return (
      <svg viewBox="0 0 200 80" className="shape-svg" fill="none">
        {/* Left Rim */}
        <rect x="20" y="20" width="65" height="42" rx="6" stroke="currentColor" strokeWidth="2.5" />
        {/* Right Rim */}
        <rect x="115" y="20" width="65" height="42" rx="6" stroke="currentColor" strokeWidth="2.5" />
        {/* Bridge */}
        <path d="M85 36 C95 31 105 31 115 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left Temple */}
        <line x1="20" y1="28" x2="6" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right Temple */}
        <line x1="180" y1="28" x2="194" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'round') {
    return (
      <svg viewBox="0 0 200 80" className="shape-svg" fill="none">
        {/* Left Rim */}
        <circle cx="54" cy="40" r="26" stroke="currentColor" strokeWidth="2.5" />
        {/* Right Rim */}
        <circle cx="146" cy="40" r="26" stroke="currentColor" strokeWidth="2.5" />
        {/* Keyhole Bridge */}
        <path d="M80 38 C90 30 110 30 120 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left Temple */}
        <line x1="28" y1="36" x2="10" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right Temple */}
        <line x1="172" y1="36" x2="190" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'aviator') {
    return (
      <svg viewBox="0 0 200 80" className="shape-svg" fill="none">
        {/* Left Teardrop Rim */}
        <path d="M22 24 C45 22 75 22 84 32 C86 44 80 58 60 62 C40 64 22 55 22 36 Z" stroke="currentColor" strokeWidth="2.5" />
        {/* Right Teardrop Rim */}
        <path d="M178 24 C155 22 125 22 116 32 C114 44 120 58 140 62 C160 64 178 55 178 36 Z" stroke="currentColor" strokeWidth="2.5" />
        {/* Top Brow Bar */}
        <line x1="26" y1="23" x2="174" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Middle Bridge */}
        <path d="M84 34 C94 30 106 30 116 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Temples */}
        <line x1="22" y1="28" x2="8" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="178" y1="28" x2="192" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'cat-eye') {
    return (
      <svg viewBox="0 0 200 80" className="shape-svg" fill="none">
        {/* Left Rim (Upswept) */}
        <path d="M16 20 C42 26 76 28 84 36 C86 48 76 60 54 60 C32 60 20 46 16 20 Z" stroke="currentColor" strokeWidth="2.5" />
        {/* Right Rim (Upswept) */}
        <path d="M184 20 C158 26 124 28 116 36 C114 48 124 60 146 60 C168 60 180 46 184 20 Z" stroke="currentColor" strokeWidth="2.5" />
        {/* Bridge */}
        <path d="M84 38 C94 32 106 32 116 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Temples */}
        <line x1="16" y1="20" x2="6" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="184" y1="20" x2="194" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'geometric') {
    return (
      <svg viewBox="0 0 200 80" className="shape-svg" fill="none">
        {/* Left Hexagonal Rim */}
        <polygon points="34,22 68,22 84,36 78,58 44,60 22,44" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Right Hexagonal Rim */}
        <polygon points="166,22 132,22 116,36 122,58 156,60 178,44" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Bridge */}
        <path d="M84 36 C94 30 106 30 116 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Temples */}
        <line x1="22" y1="44" x2="8" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="178" y1="44" x2="192" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Rimless
  return (
    <svg viewBox="0 0 200 80" className="shape-svg" fill="none">
      {/* Left Lens Dashed Outline */}
      <rect x="24" y="24" width="60" height="38" rx="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
      {/* Right Lens Dashed Outline */}
      <rect x="116" y="24" width="60" height="38" rx="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
      {/* Solid Titanium Bridge */}
      <path d="M84 36 C94 31 106 31 116 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left Screws Mount */}
      <circle cx="82" cy="36" r="2.5" fill="currentColor" />
      <circle cx="26" cy="32" r="2.5" fill="currentColor" />
      {/* Right Screws Mount */}
      <circle cx="118" cy="36" r="2.5" fill="currentColor" />
      <circle cx="174" cy="32" r="2.5" fill="currentColor" />
      {/* Temples */}
      <line x1="26" y1="32" x2="8" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="174" y1="32" x2="192" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
