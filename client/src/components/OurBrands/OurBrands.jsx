import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi2';
import './OurBrands.css';

const BRANDS = [
  {
    id: 'lumen-and-hour',
    name: 'Lumen & Hour',
    monogram: 'L · H',
    spiritBangla: 'দৃষ্টিতে আভিজাত্য',
    spiritEnglish: 'Elegance in Sight',
    tag: 'MAISON 01 // LIGHT & OPTICS',
    badge: 'Signature House',
    headline: 'Elegance in Sight, Beauty in Time.',
    description:
      'Lumen & Hour explores the poetic intersection of ambient illumination and fine eyewear. Sculpted in warm 24k gold wireframe geometry and Japanese titanium, each silhouette features proprietary crystal optics that capture optical caustics under direct sunlight.',
    attributes: [
      'Dual Optical Caustics Refraction',
      'Japanese Cold-Rolled Beta Titanium',
      'CR-39 UV400 Polarized Gradient Lenses',
    ],
    image: '/images/amber-aviator.png',
    alt: 'Lumen & Hour Luxury Eyewear',
    link: '/shop?category=sunglasses',
    ctaText: 'Explore Lumen & Hour',
  },
  {
    id: 'timeframe',
    name: 'Timeframe',
    monogram: 'T // F',
    spiritBangla: 'সময়ে সৌন্দর্য',
    spiritEnglish: 'Beauty in Time',
    tag: 'MAISON 02 // ARCHITECTURAL POISE',
    badge: 'Structural House',
    headline: 'Architectural Eyewear for Modern Eras.',
    description:
      'Timeframe strips away ornamentation to achieve pure anatomical harmony. Engineered with monobloc screwless hinges and 12-gram ultra-flexible titanium wire rims, providing zero visual distortion and balanced weight for intensive focus sessions.',
    attributes: [
      '12.0g – 14.2g Featherweight Balance',
      'Monobloc Screwless 5-Barrel Hinges',
      'Anti-Reflective Computer & Optical Lenses',
    ],
    image: '/images/hero-glasses.png',
    alt: 'Timeframe Architectural Glasses',
    link: '/shop?category=prescription-glasses',
    ctaText: 'Explore Timeframe',
  },
];

export default function OurBrands() {
  return (
    <section className="our-brands-section" id="our-brands">
      {/* Background Architectural Canvas */}
      <div className="our-brands-backdrop" aria-hidden="true" />

      <div className="container-editorial">
        {/* Section Header */}
        <div className="our-brands-header">
          <div className="our-brands-intro">
            <div className="our-brands-eyebrow-row">
              <span className="editorial-eyebrow">THE ATELIER HOUSES</span>
              <span className="our-brands-pill">
                <HiOutlineSparkles size={12} className="pill-sparkle" />
                <span>House Portfolio</span>
              </span>
            </div>
            <h2 className="editorial-section-title our-brands-title">
              OUR BRANDS
            </h2>
            <p className="editorial-body our-brands-desc">
              Two distinct design philosophies united by surgical titanium engineering,
              optical caustics, and timeless poise.
            </p>
          </div>

          <div className="our-brands-meta">
            <span className="our-brands-count">02 Portfolio Maisons</span>
          </div>
        </div>

        {/* Brands Dual Grid */}
        <div className="our-brands-grid">
          {BRANDS.map((brand, index) => (
            <article
              key={brand.id}
              className="our-brand-card"
              id={`brand-card-${brand.id}`}
            >
              {/* Card Header with Monogram & House Tag */}
              <div className="our-brand-card-top">
                <div className="our-brand-monogram-box">
                  <span className="our-brand-monogram">{brand.monogram}</span>
                </div>
                <div className="our-brand-top-meta">
                  <span className="our-brand-tag">{brand.tag}</span>
                  <span className="our-brand-badge">{brand.badge}</span>
                </div>
              </div>

              {/* Brand Visual Showcase */}
              <div className="our-brand-image-stage">
                <img
                  src={brand.image}
                  alt={brand.alt}
                  className="our-brand-image"
                  loading="lazy"
                />
                <div className="our-brand-image-sheen" />
                <div className="our-brand-index-indicator">{`0${index + 1}`}</div>
              </div>

              {/* Brand Information & Story */}
              <div className="our-brand-content">
                <div className="our-brand-title-row">
                  <h3 className="our-brand-name">{brand.name}</h3>
                  <div className="our-brand-taglines">
                    <span className="our-brand-spirit-bangla">{brand.spiritBangla}</span>
                    <span className="our-brand-spirit-en">{brand.spiritEnglish}</span>
                  </div>
                </div>

                <p className="our-brand-headline">{brand.headline}</p>
                <p className="our-brand-desc">{brand.description}</p>

                {/* Technical Pillar Chips */}
                <div className="our-brand-attributes">
                  {brand.attributes.map((attr, aIdx) => (
                    <div key={aIdx} className="our-brand-attr-item">
                      <span className="attr-dot" />
                      <span className="attr-text">{attr}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="our-brand-cta-wrap">
                  <Link
                    to={brand.link}
                    className="btn-editorial our-brand-cta"
                    id={`btn-explore-${brand.id}`}
                  >
                    <span>{brand.ctaText}</span>
                    <HiArrowRight size={16} className="btn-arrow" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Minimalist House Marquee / Strip */}
        <div className="our-brands-marquee-strip" aria-hidden="true">
          <div className="marquee-item">LUMEN &amp; HOUR</div>
          <span className="marquee-sep">✦</span>
          <div className="marquee-item">TIMEFRAME</div>
          <span className="marquee-sep">✦</span>
          <div className="marquee-item">DRISHTI ATELIER</div>
          <span className="marquee-sep">✦</span>
          <div className="marquee-item">LUMEN &amp; HOUR</div>
          <span className="marquee-sep">✦</span>
          <div className="marquee-item">TIMEFRAME</div>
        </div>
      </div>
    </section>
  );
}
