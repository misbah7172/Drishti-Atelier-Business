import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import './FinalCTA.css';

export default function FinalCTA() {
  return (
    <section className="final-cta-section" id="final-cta-section">
      <div className="final-cta-bg" aria-hidden="true">
        <div className="final-cta-radial" />
      </div>

      <div className="container-editorial final-cta-content">
        <span className="editorial-eyebrow">The Finale</span>
        <h2 className="final-cta-title">
          FIND <br />
          YOUR <br />
          FRAME.
        </h2>
        <p className="editorial-body final-cta-desc">
          Complimentary worldwide shipping. 30-day architectural fit trial.
          Hand-inspected before leaving the atelier.
        </p>

        <div className="final-cta-action">
          <Link to="/shop" className="btn-editorial btn-lg" id="final-cta-shop-btn">
            <span>Explore The Full Collection</span>
            <HiArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
