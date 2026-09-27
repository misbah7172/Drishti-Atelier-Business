import { useState } from 'react';
import './ProductAnatomy.css';

const chapters = [
  {
    id: '01',
    title: 'Titanium Brow Architecture',
    subtitle: 'Aerospace Structural Integrity',
    desc: 'Laser-cut from cold-rolled Japanese titanium alloy. The elevated top brow bar provides dynamic torsional rigidity while weighing under 4.2 grams.',
    image: '/images/blue-aviator.png',
    spec: 'Grade 5 Titanium / 0.8mm Thickness',
  },
  {
    id: '02',
    title: 'Optical Caustics & Clarity',
    subtitle: 'Precision Multi-Coated Lenses',
    desc: 'Equipped with custom CR-39 and polarized crystal optics featuring 8-layer anti-reflective interior coating for high-contrast clarity in harsh overhead sunlight.',
    image: '/images/hero-glasses.png',
    spec: '100% UVA/UVB 400 Protection',
  },
  {
    id: '03',
    title: 'Monobloc Five-Barrel Hinge',
    subtitle: 'Screwless Friction Articulation',
    desc: 'Machined from a single block of solid metal. Dual internal dampening washers deliver smooth tactile resistance tested across 50,000 continuous opening cycles.',
    image: '/images/amber-aviator.png',
    spec: 'Self-Lubricating Bushing System',
  },
  {
    id: '04',
    title: 'Anatomical Pressure Distribution',
    subtitle: 'Ergonomic Weight Balancing',
    desc: 'Micro-sculpted silicone nose pads adapt immediately to facial contours. The center of gravity is calibrated rearward along the temples to eliminate nasal fatigue.',
    image: '/images/blue-aviator.png',
    spec: 'Hypoallergenic Medical Silicone',
  },
  {
    id: '05',
    title: 'Satin & Mirror Hand Buffing',
    subtitle: 'Artisanal Surface Contrast',
    desc: 'Each frame spends 72 hours undergoing microscopic ceramic tumbling followed by hand-buffed satin brushing and mirror chrome edge beveling.',
    image: '/images/amber-aviator.png',
    spec: 'Hand-Finished in 46 Steps',
  },
];

export default function ProductAnatomy() {
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <section className="anatomy-section" id="anatomy-section">
      <div className="container-editorial">
        {/* Section Header */}
        <div className="anatomy-header">
          <span className="editorial-eyebrow">The Engineering Story</span>
          <h2 className="editorial-section-title">
            ANATOMY OF <br />
            <span className="text-muted-editorial">THE FRAME.</span>
          </h2>
          <p className="editorial-body anatomy-header-desc">
            A radical departure from mass-produced acetate. Explore the structural
            innovations that define Drishti Atelier eyewear.
          </p>
        </div>

        {/* Interactive Sticky Anatomy Showcase */}
        <div className="anatomy-showcase">
          {/* Left: Sticky Macro Image Stage */}
          <div className="anatomy-visual-stage">
            <div className="anatomy-image-card">
              <img
                src={chapters[activeChapter].image}
                alt={chapters[activeChapter].title}
                className="anatomy-product-img"
              />
              <div className="anatomy-image-overlay" />

              {/* Dynamic Macro Chapter Badge */}
              <div className="anatomy-spec-badge">
                <span className="badge-chapter-num">{chapters[activeChapter].id}</span>
                <span className="badge-spec-text">{chapters[activeChapter].spec}</span>
              </div>
            </div>
          </div>

          {/* Right: Narrative Chapters Track */}
          <div className="anatomy-track">
            {chapters.map((ch, idx) => {
              const isActive = activeChapter === idx;
              return (
                <div
                  key={ch.id}
                  className={`anatomy-chapter-card ${isActive ? 'chapter-active' : ''}`}
                  onClick={() => setActiveChapter(idx)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="chapter-header">
                    <span className="chapter-number">{ch.id}</span>
                    <span className="chapter-subtitle">{ch.subtitle}</span>
                  </div>
                  <h3 className="chapter-title">{ch.title}</h3>
                  <p className="chapter-desc">{ch.desc}</p>
                  <div className="chapter-progress-bar">
                    <div className="chapter-progress-fill" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
