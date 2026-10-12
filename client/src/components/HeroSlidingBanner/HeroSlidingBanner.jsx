import './HeroSlidingBanner.css';

export default function HeroSlidingBanner() {
  return (
    <section className="hero-banner-section" id="hero-banner" aria-label="Hero Banner">
      <div className="hero-banner-container">
        <div className="hero-banner-frame">
          <img
            src="/images/hero-banner.png"
            alt="Drishti Atelier Eyewear Collection 2026 Banner"
            className="hero-banner-img"
            width="1500"
            height="500"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
