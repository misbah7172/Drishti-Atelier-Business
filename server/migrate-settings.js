const { query } = require('./db/pool');

async function migrate() {
  await query(`CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    label VARCHAR(200),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`);

  await query(`INSERT INTO site_settings (key, value, category, label) VALUES
    ('site_name', 'Drishti Atelier', 'general', 'Site Name'),
    ('site_tagline', 'Premium Eyewear for the Modern Eye', 'general', 'Tagline'),
    ('site_description', 'Bangladesh''s premier destination for luxury eyewear.', 'general', 'Site Description'),
    ('contact_email', 'hello@drishtiatelier.com', 'contact', 'Contact Email'),
    ('contact_phone', '+880 1700-000-000', 'contact', 'Phone Number'),
    ('contact_address', 'House 42, Road 11, Block D, Dhanmondi, Dhaka 1205', 'contact', 'Address'),
    ('business_hours', 'Sat-Thu: 10AM - 8PM, Friday: Closed', 'contact', 'Business Hours'),
    ('social_instagram', 'https://instagram.com/drishtiatelier', 'social', 'Instagram URL'),
    ('social_twitter', 'https://x.com/drishtiatelier', 'social', 'X (Twitter) URL'),
    ('social_facebook', '', 'social', 'Facebook URL'),
    ('shipping_fee_dhaka', '60', 'store', 'Shipping Fee (Dhaka)'),
    ('shipping_fee_outside', '120', 'store', 'Shipping Fee (Outside Dhaka)'),
    ('free_shipping_threshold', '3000', 'store', 'Free Shipping Above'),
    ('min_order_amount', '0', 'store', 'Minimum Order Amount'),
    ('seo_title', 'Drishti Atelier - Premium Eyewear', 'seo', 'Default Page Title'),
    ('seo_description', 'Shop luxury sunglasses, optical frames, and blue light glasses at Drishti Atelier.', 'seo', 'Default Meta Description'),
    ('seo_keywords', 'eyewear, sunglasses, optical frames, Bangladesh, luxury, Drishti', 'seo', 'Meta Keywords'),
    ('google_analytics_id', '', 'seo', 'Google Analytics ID')
  ON CONFLICT (key) DO NOTHING`);

  console.log('✅ site_settings table created and seeded');
  process.exit(0);
}

migrate().catch(e => { console.error(e); process.exit(1); });
