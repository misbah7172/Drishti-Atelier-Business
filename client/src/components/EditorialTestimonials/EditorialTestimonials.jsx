import { useState } from 'react';
import { HiOutlineStar } from 'react-icons/hi2';
import './EditorialTestimonials.css';

const testimonials = [
  {
    quote: 'THE FRAME I FORGET I’M WEARING. ABSOLUTE FEATHERWEIGHT BALANCE.',
    author: 'Arif Rahman',
    role: 'Creative Director / London',
    rating: 5,
    frame: 'Vapour Titanium Aviator',
  },
  {
    quote: 'OPTICAL CAUSTICS ARE CRYSTALLINE. NOTHING IN FAST FASHION COMPARES.',
    author: 'Fatima Akter',
    role: 'Architect / Dhaka',
    rating: 5,
    frame: 'Monolith Geometric Wire',
  },
  {
    quote: 'PACKAGED LIKE HIGH JEWELLERY. THE FIVE-BARREL HINGE IS PURE PRECISION.',
    author: 'Kazi Hasan',
    role: 'Product Designer / Singapore',
    rating: 5,
    frame: 'Amber Horizon Navigator',
  },
];

export default function EditorialTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const active = testimonials[currentIndex];

  return (
    <section className="testimonials-editorial-section" id="testimonials-section">
      <div className="container-editorial">
        <div className="testimonials-editorial-wrapper">
          <span className="editorial-eyebrow">Client Reflections</span>

          <div className="testimonial-quote-box" key={currentIndex}>
            <div className="testimonial-stars-row">
              {Array.from({ length: active.rating }).map((_, i) => (
                <HiOutlineStar key={i} size={15} className="star-icon" />
              ))}
            </div>

            <blockquote className="testimonial-editorial-quote">
              “{active.quote}”
            </blockquote>

            <div className="testimonial-attribution">
              <span className="testimonial-author-name">— {active.author}</span>
              <span className="testimonial-author-role">{active.role}</span>
              <span className="testimonial-frame-tag">Verified Owner of {active.frame}</span>
            </div>
          </div>

          {/* Minimalist Switcher Dots */}
          <div className="testimonial-dots" role="tablist">
            {testimonials.map((t, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={currentIndex === idx}
                className={`testimonial-dot ${currentIndex === idx ? 'dot-active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Testimonial from ${t.author}`}
              >
                <span className="dot-line" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
