import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import './FullscreenMoments.css';

export default function FullscreenMoments() {
  return (
    <section className="fullscreen-moment-section" id="fullscreen-moment">
      <div className="fullscreen-moment-bg" aria-hidden="true">
        <img
          src="/images/dark-silhouette.png"
          alt="Drishti Eyewear Silhouette Floating in Darkness"
          className="fullscreen-moment-img"
        />
        <div className="fullscreen-moment-vignette" />
      </div>

      <div className="container-editorial fullscreen-moment-content">
        <div className="moment-text-block">
          <span className="editorial-eyebrow">Visual Manifesto</span>
          <h2 className="editorial-section-title moment-title">
            <span className="moment-title-main">BUILT FOR EVERY ANGLE.</span>{' '}
            <span className="moment-accent-text">LIGHT. FORM. IDENTITY.</span>
          </h2>
          <p className="editorial-body moment-body">
            In absolute darkness, only the illuminated metallic brow remains visible.
            A masterclass in optical geometry, sculpted to feel weightless on the face
            and unmistakable across the room.
          </p>

          <div className="moment-action">
            <Link to="/shop" className="btn-editorial">
              <span>View The Archive</span>
              <HiArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="moment-metadata-block">
          <div className="moment-meta-item">
            <span className="meta-label">CHASSIS WEIGHT</span>
            <span className="meta-val">18.4 GRAMS</span>
          </div>
          <div className="moment-meta-item">
            <span className="meta-label">ORIGIN</span>
            <span className="meta-val">JAPANESE TITANIUM</span>
          </div>
          <div className="moment-meta-item">
            <span className="meta-label">EDITION</span>
            <span className="meta-val">ATELIER SERIES 01</span>
          </div>
        </div>
      </div>
    </section>
  );
}
