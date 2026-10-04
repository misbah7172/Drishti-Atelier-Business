import { useState } from 'react';
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope, HiOutlineClock } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import api from '../../services/api';
import '../PublicPages.css';
import SEO from '../../components/SEO/SEO';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return toast.error('Please fill all required fields');
    setSending(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you soon.', { style: { background: '#070707', color: '#fff', border: '1px solid #222' } });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send'); }
    finally { setSending(false); }
  };

  return (
    <div className="public-page" id="contact-page">
      <SEO title="Contact Us" description="Get in touch with Drishti Atelier. Visit our showroom or reach us by phone, email." />
      <div className="public-hero">
        <h1 className="public-hero-title">Contact <span className="public-hero-accent">Us</span></h1>
        <p className="public-hero-sub">Have a question or need assistance? Our team is here to help.</p>
      </div>
      <div className="public-divider" />

      <div className="contact-grid">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-row">
            <div className="contact-group"><label className="contact-label">Name *</label><input className="contact-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" /></div>
            <div className="contact-group"><label className="contact-label">Email *</label><input type="email" className="contact-input" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" /></div>
          </div>
          <div className="contact-row">
            <div className="contact-group"><label className="contact-label">Phone</label><input className="contact-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+880 17XX XXX XXX" /></div>
            <div className="contact-group"><label className="contact-label">Subject *</label><input className="contact-input" value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="How can we help?" /></div>
          </div>
          <div className="contact-group"><label className="contact-label">Message *</label><textarea className="contact-textarea" value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us more..." /></div>
          <button type="submit" className="contact-submit" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
        </form>

        <div className="contact-info">
          <div className="contact-info-item"><HiOutlineMapPin size={18} className="contact-info-icon" /><div><p className="contact-info-label">Visit Us</p><p className="contact-info-value">House 42, Road 11, Block D<br/>Dhanmondi, Dhaka 1205</p></div></div>
          <div className="contact-info-item"><HiOutlinePhone size={18} className="contact-info-icon" /><div><p className="contact-info-label">Call Us</p><p className="contact-info-value">+880 1700-000-000<br/>+880 1711-111-111</p></div></div>
          <div className="contact-info-item"><HiOutlineEnvelope size={18} className="contact-info-icon" /><div><p className="contact-info-label">Email</p><p className="contact-info-value">hello@drishtiatelier.com<br/>support@drishtiatelier.com</p></div></div>
          <div className="contact-info-item"><HiOutlineClock size={18} className="contact-info-icon" /><div><p className="contact-info-label">Hours</p><p className="contact-info-value">Sat–Thu: 10AM – 8PM<br/>Friday: Closed</p></div></div>
        </div>
      </div>
    </div>
  );
}

