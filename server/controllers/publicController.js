const { query } = require('../db/pool');

/** POST /api/contact — Submit contact form */
async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ status: 'fail', message: 'Name, email, subject, and message are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid email address.' });
    }
    await query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)',
      [name.trim(), email.trim().toLowerCase(), phone || null, subject.trim(), message.trim()]
    );
    res.status(201).json({ status: 'success', message: 'Message sent successfully. We will get back to you soon.' });
  } catch (error) { next(error); }
}

/** POST /api/newsletter — Subscribe to newsletter */
async function subscribeNewsletter(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'fail', message: 'Email is required.' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ status: 'fail', message: 'Invalid email.' });

    // Upsert: if already exists, resubscribe
    await query(
      `INSERT INTO newsletter_subscribers (email, is_subscribed, subscribed_at)
       VALUES ($1, true, NOW())
       ON CONFLICT (email) DO UPDATE SET is_subscribed = true, subscribed_at = NOW(), unsubscribed_at = NULL`,
      [email.trim().toLowerCase()]
    );
    res.status(201).json({ status: 'success', message: 'Subscribed successfully!' });
  } catch (error) { next(error); }
}

module.exports = { submitContact, subscribeNewsletter };
