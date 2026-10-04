import '../PublicPages.css';
import SEO from '../../components/SEO/SEO';

export default function Terms() {
  return (
    <div className="public-page" id="terms-page">
      <SEO title="Terms and Conditions" description="Terms and conditions for using Drishti Atelier — orders, shipping, returns, and more." />
      <div className="public-hero">
        <h1 className="public-hero-title">Terms & <span className="public-hero-accent">Conditions</span></h1>
        <p className="public-hero-sub">Please read these terms carefully before using our services.</p>
      </div>
      <div className="public-divider" />

      <div className="legal-content">
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using Drishti Atelier ("the Website"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Website.</p>

        <h3>2. Products & Pricing</h3>
        <p>All product descriptions, images, and prices are provided in good faith. Prices are listed in Bangladeshi Taka (BDT/৳) and are inclusive of applicable taxes. We reserve the right to modify prices without prior notice. In the event of a pricing error, we will notify you and offer the option to cancel your order.</p>

        <h3>3. Orders & Payment</h3>
        <ul>
          <li>An order is confirmed only after payment verification (or acceptance of COD).</li>
          <li>We reserve the right to cancel orders due to stock unavailability, pricing errors, or suspected fraud.</li>
          <li>Cash on Delivery (COD) is available within Bangladesh.</li>
        </ul>

        <h3>4. Shipping & Delivery</h3>
        <p>We aim to deliver within 1–2 business days in Dhaka and 3–5 business days outside Dhaka. Delivery times are estimates and not guarantees. Risk of loss transfers to you upon delivery.</p>

        <h3>5. Returns & Refunds</h3>
        <ul>
          <li>Unused items may be returned within 7 days of delivery in original packaging.</li>
          <li>Prescription lenses and customized items are non-returnable.</li>
          <li>Refunds are processed within 5–7 business days after receiving the returned item.</li>
        </ul>

        <h3>6. User Accounts</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials. You must not share your account with others. We reserve the right to suspend accounts that violate these terms.</p>

        <h3>7. Intellectual Property</h3>
        <p>All content on the Website — including logos, text, images, and design — is the property of Drishti Atelier and is protected by copyright law. Unauthorized reproduction is prohibited.</p>

        <h3>8. Limitation of Liability</h3>
        <p>Drishti Atelier shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Website or products purchased through it.</p>

        <h3>9. Governing Law</h3>
        <p>These terms are governed by and construed in accordance with the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka.</p>

        <p className="legal-updated">Last updated: September 2026</p>
      </div>
    </div>
  );
}

