const { query } = require('./db/pool');

async function migrate() {
  console.log('🔄 Creating banners table...');

  await query(`CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    badge VARCHAR(100),
    image_url TEXT NOT NULL,
    cta_text VARCHAR(100) DEFAULT 'Explore Collection',
    cta_link VARCHAR(255) DEFAULT '/shop',
    section VARCHAR(50) NOT NULL DEFAULT 'hero',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`);

  // Check if initial hero banners exist
  const existing = await query(`SELECT COUNT(*) FROM banners WHERE section = 'hero'`);
  const count = parseInt(existing.rows[0].count, 10);

  if (count === 0) {
    console.log('🌱 Seeding default 5 hero banners...');
    const seedBanners = [
      {
        badge: 'NEW COLLECTION 2026',
        title: 'Architectural Atelier Eyewear',
        subtitle: 'Precision minimalist silhouettes sculpted with timeless Japanese engineering.',
        cta_text: 'Explore Collection',
        cta_link: '/shop?featured=true',
        image_url: '/images/hero-banner-1.jpg',
        section: 'hero',
        sort_order: 1,
      },
      {
        badge: 'FEATHERWEIGHT ENGINEERING',
        title: 'Japanese Beta-Titanium Architecture',
        subtitle: 'Under 12 grams of pure balance, flexible temples, and zero pressure points.',
        cta_text: 'Discover Titanium',
        cta_link: '/shop?material=Titanium',
        image_url: '/images/hero-banner-2.jpg',
        section: 'hero',
        sort_order: 2,
      },
      {
        badge: 'MEDITERRANEAN ARCHIVE',
        title: 'Polarized Sunwear Collection',
        subtitle: 'UV400 high-clarity polarized optics crafted for golden sun and coastal escapes.',
        cta_text: 'Shop Sunwear',
        cta_link: '/shop?category=sunglasses',
        image_url: '/images/hero-banner-3.jpg',
        section: 'hero',
        sort_order: 3,
      },
      {
        badge: 'HERITAGE ARTISANRY',
        title: 'Sculpted Mazzucchelli Bio-Acetate',
        subtitle: 'Warm tortoiseshell tones and hand-buffed plant-based Italian acetate frames.',
        cta_text: 'Shop Handcrafted Acetate',
        cta_link: '/shop?material=Acetate',
        image_url: '/images/hero-banner-4.jpg',
        section: 'hero',
        sort_order: 4,
      },
      {
        badge: 'DIGITAL EYE-SHIELD',
        title: 'Anti-Blue Light Vision Protection',
        subtitle: 'Sapphire multi-coated optics engineered to eliminate eye fatigue and screen glare.',
        cta_text: 'Explore Screen Glasses',
        cta_link: '/shop?category=blue-light-glasses',
        image_url: '/images/hero-banner-5.jpg',
        section: 'hero',
        sort_order: 5,
      },
    ];

    for (const b of seedBanners) {
      await query(
        `INSERT INTO banners (title, subtitle, badge, image_url, cta_text, cta_link, section, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)`,
        [b.title, b.subtitle, b.badge, b.image_url, b.cta_text, b.cta_link, b.section, b.sort_order]
      );
    }
    console.log(`✅ Seeded ${seedBanners.length} hero banners.`);
  } else {
    console.log(`ℹ️ Banners table already has ${count} hero banners.`);
  }

  console.log('✅ Banners migration completed successfully.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
