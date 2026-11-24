import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicBanners } from '../../services/bannerService';
import './HeroSlidingBanner.css';

export default function HeroSlidingBanner() {
  const [content, setContent] = useState({
    lead: 'Stylish protection for your',
    accent: 'eyes',
    ctaText: 'Shop now',
    link: '/shop',
  });

  // Fetch optional dynamic overrides from database if configured
  useEffect(() => {
    let isMounted = true;
    getPublicBanners('hero')
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const first = data[0];
          setContent({
            lead: first.subtitle || 'Stylish protection for your',
            accent: first.title || 'eyes',
            ctaText: first.cta_text || 'Shop now',
            link: first.cta_link || '/shop',
          });
        }
      })
      .catch(() => {
        // Fallback to default editorial text silently
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      className="hero-minimal-section hero-banner-section"
      id="hero-banner"
      aria-label="Hero Spotlight"
    >
      <div className="hero-minimal-container">
        <div className="hero-minimal-frame">
          {/* Main Visual: Crystal Eyewear with organic leaf shadow */}
          <div className="hero-minimal-visual">
            <picture>
              <source
                media="(min-width: 641px)"
                srcSet="/images/hero-minimal-clean@2x.jpg"
              />
              <img
                src="/images/hero-crystal-glasses.png"
                alt="Drishti Atelier — Minimalist Crystal Clear Eyewear"
                className="hero-minimal-img"
                fetchPriority="high"
                loading="eager"
                width="945"
                height="505"
              />
            </picture>
            <div className="hero-leaf-shadow" aria-hidden="true" />
          </div>

          {/* Minimal Editorial Typography & Action */}
          <div className="hero-minimal-content">
            <h1 className="hero-minimal-heading">
              <span className="hero-lead-line">{content.lead}</span>
              <span className="hero-accent-serif">{content.accent}</span>
            </h1>

            <Link
              to={content.link}
              className="hero-minimal-cta"
              id="hero-shop-now-btn"
            >
              <span>{content.ctaText}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
