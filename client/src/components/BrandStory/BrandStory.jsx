import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import './BrandStory.css';

export default function BrandStory() {
  return (
    <section className="brand-story-section" id="brand-story-section">
      {/* Benefit Statements Banner (HEAVN-Style Large Typography) */}
      <div className="benefits-statement-banner">
        <div className="container-editorial">
          <div className="statement-grid">
            <div className="statement-block">
              <span className="statement-num">01 / PROPORTION</span>
              <h3 className="statement-title">
                LIGHTWEIGHT WITHOUT <br />
                FEELING FRAGILE.
              </h3>
              <p className="editorial-body statement-desc">
                By redistributing mass toward the temple pivot, our titanium frames
                eliminate downward pressure on the bridge of the nose.
              </p>
            </div>

            <div className="statement-block">
              <span className="statement-num">02 / ENDURANCE</span>
              <h3 className="statement-title">
                ENGINEERED FOR LONG <br />
                DAYS IN THE LIGHT.
              </h3>
              <p className="editorial-body statement-desc">
                High-performance polarization and anti-glare interior coatings keep your
                vision relaxed whether driving at noon or working under fluorescent glare.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand Manifesto & Campaign Editorial */}
      <div className="manifesto-wrapper">
        <div className="container-editorial manifesto-grid">
          <div className="manifesto-image-side">
            <img
              src="/images/lifestyle-model.png"
              alt="Drishti Atelier Fashion Campaign"
              className="manifesto-image"
              loading="lazy"
            />
            <div className="manifesto-image-caption">
              <span>Campaign 2026 — The Human Contour</span>
            </div>
          </div>

          <div className="manifesto-text-side">
            <span className="editorial-eyebrow">The Manifesto</span>
            <h2 className="editorial-section-title manifesto-title">
              WHY WE <br />
              MAKE GLASSES.
            </h2>
            <p className="editorial-body manifesto-p">
              Eyewear sits at the immediate center of human expression. It is the first
              object the world observes when engaging with your gaze.
            </p>
            <p className="editorial-body manifesto-p">
              We reject disposable fast-fashion frames that warp within months. Drishti
              Atelier was founded on a singular conviction: that eyeglasses should be
              approached like architectural monuments — structural, enduring, and pure.
            </p>

            <div className="manifesto-action">
              <Link to="/about" className="btn-editorial">
                <span>Read Full Origin</span>
                <HiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
