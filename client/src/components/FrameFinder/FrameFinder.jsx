import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi2';
import './FrameFinder.css';

const faceShapes = ['Oval', 'Round', 'Square', 'Heart'];
const styles = ['MINIMAL', 'CLASSIC', 'BOLD', 'MODERN'];
const categories = [
  { label: 'Sunglasses', slug: 'sunglasses' },
  { label: 'Optical Lenses', slug: 'prescription-glasses' },
  { label: 'Blue Light', slug: 'blue-light-glasses' },
];

const recommendations = {
  'Oval-MINIMAL': {
    name: 'Vapour Titanium Aviator',
    desc: 'Elongated horizontal brow balancing natural facial symmetry.',
    image: '/images/blue-aviator.png',
    price: '$240',
    link: '/shop?category=sunglasses',
  },
  'Round-BOLD': {
    name: 'Monolith Geometric Wire',
    desc: 'Angular wireframes providing sharp contrast against curved jawlines.',
    image: '/images/hero-glasses.png',
    price: '$210',
    link: '/shop?category=prescription-glasses',
  },
  'Square-CLASSIC': {
    name: 'Amber Horizon Navigator',
    desc: 'Softened curved corners breaking linear cheekbones with warm optics.',
    image: '/images/amber-aviator.png',
    price: '$260',
    link: '/shop?category=sunglasses',
  },
  'Heart-MODERN': {
    name: 'Heart Contour Statement',
    desc: 'Sculpted lower frame expanding width at the lower jaw.',
    image: '/images/heart-sunglasses.png',
    price: '$280',
    link: '/shop?category=sunglasses',
  },
};

export default function FrameFinder() {
  const [selectedShape, setSelectedShape] = useState('Oval');
  const [selectedStyle, setSelectedStyle] = useState('MINIMAL');
  const [selectedCategory, setSelectedCategory] = useState('sunglasses');

  const key = `${selectedShape}-${selectedStyle}`;
  const match = recommendations[key] || recommendations['Oval-MINIMAL'];

  return (
    <section className="finder-section" id="finder-section">
      <div className="container-editorial">
        <div className="finder-header">
          <span className="editorial-eyebrow">Curated Fit Consultation</span>
          <h2 className="editorial-section-title">
            FIND YOUR <br />
            <span className="text-muted-editorial">PERFECT FRAME.</span>
          </h2>
          <p className="editorial-body">
            Select your facial architecture and personal aesthetic to reveal the
            harmonious Drishti frame calibrated for your balance.
          </p>
        </div>

        <div className="finder-layout-grid">
          {/* Left Controls */}
          <div className="finder-controls-panel">
            {/* Step 1: Face Shape */}
            <div className="finder-filter-group">
              <label className="filter-group-label">01 / YOUR FACE SHAPE</label>
              <div className="filter-pills-row">
                {faceShapes.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    className={`finder-pill ${selectedShape === shape ? 'pill-active' : ''}`}
                    onClick={() => setSelectedShape(shape)}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Aesthetic Vibe */}
            <div className="finder-filter-group">
              <label className="filter-group-label">02 / AESTHETIC VIBE</label>
              <div className="filter-pills-row">
                {styles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`finder-pill ${selectedStyle === style ? 'pill-active' : ''}`}
                    onClick={() => setSelectedStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Lens Type */}
            <div className="finder-filter-group">
              <label className="filter-group-label">03 / LENS FUNCTION</label>
              <div className="filter-pills-row">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    className={`finder-pill ${selectedCategory === cat.slug ? 'pill-active' : ''}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Dynamic Match Recommendation Card */}
          <div className="finder-match-card">
            <div className="match-card-eyebrow">
              <HiOutlineSparkles size={16} className="match-sparkle-icon" />
              <span>Optimized Match: 98% Compatibility</span>
            </div>

            <div className="match-image-box">
              <img src={match.image} alt={match.name} className="match-product-img" />
            </div>

            <div className="match-info">
              <h4 className="match-title">{match.name}</h4>
              <p className="match-desc">{match.desc}</p>
              <div className="match-footer-row">
                <span className="match-price">{match.price} USD</span>
                <Link to={match.link} className="btn-editorial btn-sm">
                  <span>View Matched Frame</span>
                  <HiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
