import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import '../PublicPages.css';

const FAQS = [
  { q: 'How do I know the eyewear is authentic?', a: 'Every product at Drishti Atelier is sourced directly from authorized distributors and brand partners. We guarantee 100% authenticity on all items, and each order comes with a certificate of authenticity where applicable.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day hassle-free return policy. If you are not satisfied with your purchase, you can return unused items in their original packaging within 7 days of delivery for a full refund or exchange.' },
  { q: 'Do you offer prescription lenses?', a: 'Yes! Many of our frames can be fitted with prescription lenses. During checkout, you can select the prescription lens option and upload your prescription details. Our optical team will handle the rest.' },
  { q: 'How long does delivery take?', a: 'Standard delivery within Dhaka takes 1-2 business days. Outside Dhaka, delivery typically takes 3-5 business days. Express delivery options are available at checkout for faster service.' },
  { q: 'Can I try frames before buying?', a: 'We offer a virtual try-on feature for select products. Additionally, you can visit our showroom in Dhanmondi, Dhaka to try frames in person. Our style experts are always available to help you find the perfect fit.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), bKash, Nagad, and all major credit/debit cards. For COD orders, payment is collected upon delivery.' },
  { q: 'How do I track my order?', a: 'Once your order is confirmed, you can track its status from your Account Dashboard under "Acquisition History". You will also receive email and SMS updates at each stage of the delivery process.' },
  { q: 'Do you ship outside Bangladesh?', a: 'Currently, we only ship within Bangladesh. We are working on expanding our delivery network to serve customers internationally in the near future.' },
  { q: 'How do I use a coupon code?', a: 'During checkout, you will see a "Coupon Code" field. Enter your code and click "Apply". The discount will be automatically calculated and reflected in your order total. Note that coupons cannot be combined.' },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const toggle = (i) => setOpenIdx(openIdx === i ? null : i);

  return (
    <div className="public-page" id="faq-page">
      <div className="public-hero">
        <h1 className="public-hero-title">Frequently Asked <span className="public-hero-accent">Questions</span></h1>
        <p className="public-hero-sub">Find answers to common questions about Drishti Atelier.</p>
      </div>
      <div className="public-divider" />

      <div className="faq-list">
        {FAQS.map((faq, i) => (
          <div key={i} className={`faq-item ${openIdx === i ? 'faq-open' : ''}`}>
            <button type="button" className="faq-question" onClick={() => toggle(i)}>
              {faq.q}
              <HiChevronDown size={18} className="faq-chevron" />
            </button>
            {openIdx === i && <div className="faq-answer">{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
