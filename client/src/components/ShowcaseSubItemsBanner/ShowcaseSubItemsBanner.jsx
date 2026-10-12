import { Link } from 'react-router-dom';
import './ShowcaseSubItemsBanner.css';

const SHOWCASE_PRESETS = {
  tortoise: {
    theme: 'tortoise',
    banner: {
      ctaText: 'Shop Now >',
      ctaLink: '/shop?material=Acetate',
      image: '/images/banner-acetate.jpg',
      alt: 'Drishti Atelier Handcrafted Tortoiseshell Acetate Frames',
    },
    subItems: [
      {
        id: 'tortoise-1',
        styleName: 'Style: TR52440',
        subtitle: 'Modern Rectangle',
        image: '/images/tortoise-rect.jpg',
        link: '/shop?shape=Rectangle',
        ctaText: 'Shop Now >',
      },
      {
        id: 'tortoise-2',
        styleName: 'Style: Grace20210',
        subtitle: 'Bold Square',
        image: '/images/tortoise-square.jpg',
        link: '/shop?shape=Square',
        ctaText: 'Shop Now >',
      },
      {
        id: 'tortoise-3',
        styleName: 'Style: Lindsay002',
        subtitle: 'Round Panto',
        image: '/images/tortoise-round.jpg',
        link: '/shop?shape=Round',
        ctaText: 'Shop Now >',
      },
      {
        id: 'tortoise-4',
        styleName: 'Style: TR40657',
        subtitle: 'Vintage Oval',
        image: '/images/tortoise-oval.jpg',
        link: '/shop?shape=Oval',
        ctaText: 'Shop Now >',
      },
    ],
  },
  titanium: {
    theme: 'titanium',
    banner: {
      ctaText: 'Shop Now >',
      ctaLink: '/shop?material=Titanium',
      image: '/images/banner-titanium.jpg',
      alt: 'Drishti Atelier Ultralight Titanium Eyewear Collection',
    },
    subItems: [
      {
        id: 'titan-1',
        styleName: 'Style: AT-ROUND-01',
        subtitle: 'Silver Wireframe',
        image: '/images/titan-silver.jpg',
        link: '/shop?material=Titanium',
        ctaText: 'Shop Now >',
      },
      {
        id: 'titan-2',
        styleName: 'Style: AT-PILOT-02',
        subtitle: 'Gold Aviator',
        image: '/images/titan-gold.jpg',
        link: '/shop?shape=Aviator',
        ctaText: 'Shop Now >',
      },
      {
        id: 'titan-3',
        styleName: 'Style: AT-NAV-03',
        subtitle: 'Matte Obsidian',
        image: '/images/hero-glasses.png',
        link: '/shop?shape=Rectangle',
        ctaText: 'Shop Now >',
      },
      {
        id: 'titan-4',
        styleName: 'Style: AT-SUN-04',
        subtitle: 'Polarized Amber',
        image: '/images/amber-aviator.png',
        link: '/shop?category=sunglasses',
        ctaText: 'Shop Now >',
      },
    ],
  },
};

export default function ShowcaseSubItemsBanner({
  id,
  ariaLabel = 'Featured Eyewear Showcase',
  preset = 'tortoise',
  banner: customBanner,
  subItems: customSubItems,
  theme: customTheme,
  className = '',
}) {
  const config = SHOWCASE_PRESETS[preset] || SHOWCASE_PRESETS.tortoise;
  const banner = customBanner || config.banner;
  const subItems = customSubItems || config.subItems;
  const theme = customTheme || config.theme || 'tortoise';

  return (
    <section
      className={`showcase-subitems-section ${className}`}
      id={id}
      aria-label={ariaLabel}
    >
      <div className="showcase-subitems-container">
        <div className={`showcase-subitems-wrapper theme-${theme}`}>
          {/* Top Showcase Hero Banner */}
          <div className="showcase-hero-banner">
            <div className="showcase-hero-bg">
              <img
                src={banner.image}
                alt={banner.alt || 'Eyewear Showcase'}
                className="showcase-hero-bg-img"
                width="1500"
                height="500"
                loading="lazy"
              />
              <div className="showcase-hero-overlay" />
            </div>

            <div className="showcase-hero-content">
              <Link
                to={banner.ctaLink || '/shop'}
                className="showcase-hero-cta"
                id={`${id}-main-cta`}
                aria-label={banner.ctaText || 'Shop Now'}
              >
                <span>{banner.ctaText || 'Shop Now >'}</span>
              </Link>
            </div>
          </div>

          {/* Bottom Attached 4 Sub-Items Panel */}
          <div className="showcase-subitems-panel">
            <div className="showcase-subitems-grid">
              {subItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link || '/shop'}
                  className="sub-item-card"
                  id={`subitem-${item.id}`}
                >
                  <div className="sub-item-image-box">
                    <img
                      src={item.image}
                      alt={item.styleName}
                      className="sub-item-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="sub-item-info">
                    <span className="sub-item-style-title">{item.styleName}</span>
                    {item.subtitle && (
                      <span className="sub-item-subtitle">{item.subtitle}</span>
                    )}
                  </div>

                  <div className="sub-item-btn">
                    <span>{item.ctaText || 'Shop Now >'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
