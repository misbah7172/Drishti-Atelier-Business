import '../PublicPages.css';

const VALUES = [
  { icon: '🔍', title: 'Curated Selection', desc: 'Every frame is hand-picked by our style experts for quality, design, and craftsmanship.' },
  { icon: '🛡️', title: 'Authenticity Guaranteed', desc: 'We source directly from authorized distributors — every product is 100% genuine.' },
  { icon: '👁️', title: 'Expert Guidance', desc: 'Our team helps you find the perfect frame for your face shape, lifestyle, and prescription.' },
  { icon: '💎', title: 'Premium Quality', desc: 'From acetate to titanium, we offer only the finest materials used by luxury brands worldwide.' },
  { icon: '🚀', title: 'Fast Delivery', desc: 'Swift nationwide delivery across Bangladesh with careful packaging for every order.' },
  { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free return policy if your eyewear does not meet your expectations.' },
];

export default function About() {
  return (
    <div className="public-page" id="about-page">
      <div className="public-hero">
        <h1 className="public-hero-title">About <span className="public-hero-accent">Drishti</span></h1>
        <p className="public-hero-sub">
          Bangladesh's premier destination for luxury eyewear. We believe vision is an art — and the right frame tells your story.
        </p>
      </div>

      <div className="public-divider" />

      <section className="public-section">
        <h2 className="public-section-title">Our Story</h2>
        <p className="public-text">
          <strong>Drishti Atelier</strong> was born from a simple conviction: everyone deserves eyewear that is as exceptional as their vision. Founded in Dhaka, we set out to bridge the gap between global luxury eyewear and the discerning Bangladeshi customer.
        </p>
        <p className="public-text" style={{ marginTop: '1rem' }}>
          Our name, <strong>"Drishti"</strong> (দৃষ্টি), means <em>vision</em> in Bengali — a reflection of our mission to transform how people see and are seen. We curate frames from the world's finest ateliers and pair them with lenses of uncompromising clarity.
        </p>
      </section>

      <section className="public-section">
        <h2 className="public-section-title">Our Values</h2>
        <div className="values-grid">
          {VALUES.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3 className="value-title">{v.title}</h3>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="public-section">
        <h2 className="public-section-title">Why Choose Us</h2>
        <p className="public-text">
          At Drishti, we don't just sell eyewear — we craft experiences. From the moment you browse our collection to the instant you put on your new frames, every touchpoint is designed with care. Our <strong>optical specialists</strong> are available to guide your selection, and our <strong>quality assurance</strong> team inspects every piece before it reaches you.
        </p>
      </section>
    </div>
  );
}
