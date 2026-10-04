import '../PublicPages.css';

export default function Privacy() {
  return (
    <div className="public-page" id="privacy-page">
      <div className="public-hero">
        <h1 className="public-hero-title">Privacy <span className="public-hero-accent">Policy</span></h1>
        <p className="public-hero-sub">Your privacy matters to us. Here's how we handle your data.</p>
      </div>
      <div className="public-divider" />

      <div className="legal-content">
        <h3>1. Information We Collect</h3>
        <p>When you use Drishti Atelier, we may collect the following information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address when you create an account or place an order.</li>
          <li><strong>Order Information:</strong> Products purchased, order history, payment method used.</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on site, browser type, and device information.</li>
        </ul>

        <h3>2. How We Use Your Information</h3>
        <p>We use your information to:</p>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations, shipping updates, and delivery notifications</li>
          <li>Improve our website and customer experience</li>
          <li>Send promotional emails (only with your consent)</li>
          <li>Prevent fraud and ensure security</li>
        </ul>

        <h3>3. Data Sharing</h3>
        <p>We do <strong>not</strong> sell your personal data. We may share information with trusted third-party services only for order fulfillment (e.g., delivery partners) and payment processing.</p>

        <h3>4. Data Security</h3>
        <p>We use industry-standard encryption (SSL/TLS) for all data transfers. Passwords are hashed using bcrypt. We regularly audit our systems for vulnerabilities.</p>

        <h3>5. Cookies</h3>
        <p>We use cookies to maintain your session, remember your preferences, and analyze site traffic. You can disable cookies in your browser settings, though this may affect site functionality.</p>

        <h3>6. Your Rights</h3>
        <p>You have the right to access, correct, or delete your personal data at any time. Contact us at <strong>privacy@drishtiatelier.com</strong> for any data-related requests.</p>

        <h3>7. Updates to This Policy</h3>
        <p>We may update this policy from time to time. Changes will be posted on this page with an updated revision date.</p>

        <p className="legal-updated">Last updated: September 2026</p>
      </div>
    </div>
  );
}
