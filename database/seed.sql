-- ============================================
-- Drishti — Seed Data
-- ============================================
-- Run AFTER schema.sql
-- Usage: node database/run-seed.js
-- ============================================

-- ============================================
-- CATEGORIES (7)
-- ============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Sunglasses',          'sunglasses',          'Stylish sunglasses for UV protection and fashion',          1),
  ('Prescription Glasses','prescription-glasses', 'Corrective lenses for clear Drishti every day',             2),
  ('Blue Light Glasses',  'blue-light-glasses',  'Protect your eyes from harmful blue light screens',         3),
  ('Men',                 'men',                 'Eyewear designed for men',                                  4),
  ('Women',               'women',               'Eyewear designed for women',                                5),
  ('Unisex',              'unisex',              'Eyewear for everyone',                                      6),
  ('Kids',                'kids',                'Safe and durable eyewear for children',                     7);

-- ============================================
-- SUBCATEGORIES
-- ============================================
INSERT INTO subcategories (category_id, name, slug, sort_order) VALUES
  -- Sunglasses
  (1, 'Aviator',     'aviator-sunglasses',     1),
  (1, 'Wayfarer',    'wayfarer-sunglasses',    2),
  (1, 'Round',       'round-sunglasses',       3),
  (1, 'Sport',       'sport-sunglasses',       4),
  -- Prescription
  (2, 'Single Drishti','single-Drishti',          1),
  (2, 'Bifocal',     'bifocal',                2),
  (2, 'Progressive', 'progressive',            3),
  -- Blue Light
  (3, 'Computer',    'computer-glasses',        1),
  (3, 'Gaming',      'gaming-glasses',          2),
  -- Men
  (4, 'Formal',      'men-formal',              1),
  (4, 'Casual',      'men-casual',              2),
  -- Women
  (5, 'Cat Eye',     'women-cat-eye',           1),
  (5, 'Oversized',   'women-oversized',         2),
  -- Kids
  (7, 'Flexible',    'kids-flexible',            1),
  (7, 'Sporty',      'kids-sporty',              2);

-- ============================================
-- TAGS (8)
-- ============================================
INSERT INTO tags (name, slug) VALUES
  ('New',          'new'),
  ('Trending',     'trending'),
  ('Best Seller',  'best-seller'),
  ('Premium',      'premium'),
  ('Sale',         'sale'),
  ('Lightweight',  'lightweight'),
  ('Polarized',    'polarized'),
  ('UV Protection','uv-protection');

-- ============================================
-- PRODUCTS (24 realistic eyewear products)
-- ============================================
INSERT INTO products (name, slug, sku, description, short_description, price, compare_price, stock, low_stock_threshold, category_id, subcategory_id, brand, frame_material, frame_shape, frame_color, gender, size, status, featured, bestseller, new_arrival) VALUES

-- 1
('Classic Aviator Sunglasses', 'classic-aviator-sunglasses', 'VEC-SUN-001',
 'Timeless aviator sunglasses with premium metal frame and UV400 polarized lenses. The teardrop-shaped lenses offer full eye coverage while the adjustable nose pads ensure a comfortable fit all day long. Perfect for driving, outdoor activities, and everyday style.',
 'Timeless aviator with UV400 polarized lenses',
 2450.00, 3200.00, 45, 5, 1, 1, 'Drishti Elite', 'Metal', 'Aviator', 'Gold', 'unisex', 'Medium', 'active', true, true, false),

-- 2
('Urban Wayfarer Matte Black', 'urban-wayfarer-matte-black', 'VEC-SUN-002',
 'Modern wayfarer sunglasses in a sleek matte black finish. Crafted from lightweight acetate with spring hinges for flexibility and durability. Features scratch-resistant lenses with 100% UV protection. A must-have for any eyewear collection.',
 'Sleek matte black wayfarer with spring hinges',
 1950.00, 2500.00, 60, 5, 1, 2, 'StreetVue', 'Acetate', 'Wayfarer', 'Black', 'unisex', 'Large', 'active', true, true, false),

-- 3
('Retro Round Gold Frame', 'retro-round-gold-frame', 'VEC-SUN-003',
 'Vintage-inspired round sunglasses with a thin gold metal frame. Lightweight design weighing just 22 grams. Green-tinted lenses provide natural color perception while blocking harmful UV rays. Ideal for a bohemian or classic look.',
 'Vintage round frame with green-tinted lenses',
 1750.00, NULL, 30, 5, 1, 3, 'RetroSpec', 'Metal', 'Round', 'Gold', 'unisex', 'Small', 'active', false, false, true),

-- 4
('ProSport Wrap-Around Sunglasses', 'prosport-wrap-around-sunglasses', 'VEC-SUN-004',
 'High-performance sport sunglasses designed for athletes and active lifestyles. Wrap-around design provides maximum peripheral Drishti and wind protection. Rubberized grips on the nose and temples keep them secure during intense activities. Includes a hard case and cleaning cloth.',
 'Performance sport sunglasses with wrap-around fit',
 3200.00, 3800.00, 25, 5, 1, 4, 'ActiveDrishti', 'TR90 Nylon', 'Wrap', 'Black/Red', 'men', 'Large', 'active', false, false, true),

-- 5
('Elegant Cat Eye Tortoise', 'elegant-cat-eye-tortoise', 'VEC-SUN-005',
 'Sophisticated cat-eye sunglasses in a rich tortoiseshell pattern. Handcrafted acetate frame with gradient brown lenses. The feminine silhouette adds a touch of glamour to any outfit. Features premium Italian hinges for smooth, durable operation.',
 'Sophisticated cat-eye in rich tortoiseshell',
 2800.00, 3500.00, 35, 5, 5, 12, 'Bella Vista', 'Acetate', 'Cat Eye', 'Tortoise', 'women', 'Medium', 'active', true, false, false),

-- 6
('ClearView Prescription Rectangle', 'clearview-prescription-rectangle', 'VEC-RX-001',
 'Professional rectangular prescription frames in classic black. Designed for everyday wear with a comfortable lightweight build. Compatible with single Drishti, bifocal, and progressive lenses. Adjustable nose pads and flexible temples ensure a personalized fit.',
 'Classic rectangular frames for everyday clarity',
 1800.00, 2200.00, 50, 5, 2, 5, 'ClearView', 'Metal', 'Rectangle', 'Black', 'men', 'Medium', 'active', false, true, false),

-- 7
('Harmony Oval Rose Gold', 'harmony-oval-rose-gold', 'VEC-RX-002',
 'Delicate oval prescription frames in trendy rose gold. Ultra-thin titanium frame is incredibly lightweight yet strong. The oval shape suits most face types and provides a soft, elegant look. Spring hinges adapt to your head shape for all-day comfort.',
 'Elegant oval titanium frames in rose gold',
 3500.00, 4200.00, 20, 3, 2, 5, 'Harmony', 'Titanium', 'Oval', 'Rose Gold', 'women', 'Small', 'active', true, false, true),

-- 8
('Executive Half-Rim Silver', 'executive-half-rim-silver', 'VEC-RX-003',
 'Sophisticated half-rim prescription glasses with a polished silver frame. The semi-rimless design creates a clean, professional appearance. Durable stainless steel construction with silicone nose pads for comfort. Perfect for the boardroom or casual outings.',
 'Professional half-rim frames in polished silver',
 2600.00, NULL, 40, 5, 2, 5, 'ExecLine', 'Stainless Steel', 'Rectangle', 'Silver', 'men', 'Large', 'active', false, true, false),

-- 9
('FlexiKids Round Blue', 'flexikids-round-blue', 'VEC-KID-001',
 'Fun and flexible round glasses designed specifically for kids. Made from virtually indestructible TR90 material that bends without breaking. Soft silicone temple tips keep glasses secure during play. Available with prescription or plano lenses.',
 'Virtually indestructible round frames for kids',
 1200.00, 1500.00, 55, 10, 7, 15, 'FlexiKids', 'TR90 Nylon', 'Round', 'Blue', 'kids', 'Small', 'active', false, false, true),

-- 10
('DigitalShield Pro', 'digitalshield-pro', 'VEC-BL-001',
 'Advanced blue light blocking glasses engineered for digital professionals. Filters up to 40% of harmful blue light from screens while maintaining color accuracy. Anti-reflective coating reduces glare and eye strain. Lightweight frame designed for extended computer use.',
 'Professional blue light blockers for screen use',
 1650.00, 2000.00, 70, 10, 3, 8, 'DigitalShield', 'TR90 Nylon', 'Rectangle', 'Matte Black', 'unisex', 'Medium', 'active', true, true, false),

-- 11
('GameDrishti RGB Frame', 'gameDrishti-rgb-frame', 'VEC-BL-002',
 'Gaming-focused blue light glasses with a bold frame design. Enhanced amber-tinted lenses maximize blue light filtration for marathon gaming sessions. Ergonomic temple design fits comfortably under headsets. Includes a microfiber pouch and cleaning spray.',
 'Gaming-focused blue light glasses with bold design',
 1900.00, 2400.00, 40, 5, 3, 9, 'GameDrishti', 'Polycarbonate', 'Rectangle', 'Black/Yellow', 'unisex', 'Large', 'active', false, false, true),

-- 12
('Zenith Rimless Titanium', 'zenith-rimless-titanium', 'VEC-RX-004',
 'Minimalist rimless prescription glasses in pure titanium. Weighing only 12 grams, these are among the lightest frames available. The frameless design offers an unobstructed field of Drishti and a barely-there feel. Precision-drilled lens mounting for maximum stability.',
 'Ultra-light rimless titanium frames at just 12g',
 4500.00, 5500.00, 15, 3, 2, 5, 'Zenith', 'Titanium', 'Rimless', 'Gunmetal', 'unisex', 'Medium', 'active', true, false, false),

-- 13
('Boulevard Oversized Square', 'boulevard-oversized-square', 'VEC-SUN-006',
 'Fashion-forward oversized square sunglasses for making a statement. Bold acetate frame in deep burgundy with gradient grey lenses. The oversized silhouette provides excellent sun coverage. A favorite among fashion influencers and trendsetters.',
 'Bold oversized square frames in deep burgundy',
 2200.00, 2800.00, 30, 5, 5, 13, 'Boulevard', 'Acetate', 'Square', 'Burgundy', 'women', 'Large', 'active', false, false, true),

-- 14
('Titan Sport Shield', 'titan-sport-shield', 'VEC-SUN-007',
 'Ultra-durable sport shield sunglasses with impact-resistant polycarbonate lenses. Interchangeable lens system includes clear, amber, and dark lenses for any condition. Ventilated frame prevents fogging during intense activity. Rubber grip nose bridge and temple ends.',
 'Impact-resistant sport shield with 3 lens options',
 3800.00, 4500.00, 18, 3, 4, 11, 'Titan', 'Grilamid', 'Shield', 'Matte Black', 'men', 'Large', 'active', false, false, false),

-- 15
('Luna Butterfly Pearl', 'luna-butterfly-pearl', 'VEC-SUN-008',
 'Stunning butterfly sunglasses in iridescent pearl white. The feminine butterfly shape flatters round and oval faces. Gradient pink lenses add a romantic touch. Decorated with subtle crystal accents on the temple tips.',
 'Iridescent butterfly sunglasses with crystal accents',
 2950.00, 3600.00, 22, 5, 5, 13, 'Luna', 'Acetate', 'Butterfly', 'Pearl White', 'women', 'Medium', 'active', false, true, false),

-- 16
('Scholar Classic Black', 'scholar-classic-black', 'VEC-RX-005',
 'Traditional full-rim rectangular prescription glasses. Thick black acetate frame exudes intellectual style and confidence. Spring-loaded hinges provide flexibility. An iconic shape that has stood the test of time. Suitable for all lens types.',
 'Iconic full-rim rectangle in thick black acetate',
 1500.00, NULL, 80, 10, 2, 5, 'Scholar', 'Acetate', 'Rectangle', 'Black', 'unisex', 'Medium', 'active', false, true, false),

-- 17
('AeroLite Pilot Gradient', 'aerolite-pilot-gradient', 'VEC-SUN-009',
 'Premium pilot sunglasses with gradient blue lenses. Ultra-thin beta-titanium frame combines strength with featherweight comfort. Double bridge design adds character. Adjustable silicone nose pads for a custom fit.',
 'Premium pilot with gradient blue titanium frame',
 3400.00, 4000.00, 28, 5, 1, 1, 'AeroLite', 'Beta Titanium', 'Aviator', 'Silver/Blue', 'men', 'Large', 'active', false, false, true),

-- 18
('Pixie Mini Round', 'pixie-mini-round', 'VEC-KID-002',
 'Adorable mini round glasses for young children aged 3-7. Extra-flexible hinges withstand rough handling. Hypoallergenic silicone nose pads are gentle on sensitive skin. Fun colorful frames that kids love to wear.',
 'Adorable flexible round glasses for ages 3-7',
 950.00, 1200.00, 65, 10, 7, 15, 'Pixie', 'TR90 Nylon', 'Round', 'Red/Blue', 'kids', 'Extra Small', 'active', false, false, true),

-- 19
('NightDrive Anti-Glare', 'nightdrive-anti-glare', 'VEC-BL-003',
 'Specialized night driving glasses with yellow-tinted anti-glare lenses. Reduces headlight and streetlight glare for safer nighttime driving. Clip-on option available for prescription wearers. Polarized lenses cut road surface reflections.',
 'Night driving glasses with anti-glare lenses',
 1400.00, 1800.00, 50, 10, 3, 8, 'NightDrive', 'Metal', 'Rectangle', 'Black', 'unisex', 'Medium', 'active', false, false, false),

-- 20
('Vintage Clubmaster Walnut', 'vintage-clubmaster-walnut', 'VEC-SUN-010',
 'Classic clubmaster-style sunglasses with genuine walnut wood browline. Hand-polished metal lower rim with adjustable nose pads. Green G-15 lenses provide excellent color contrast and 100% UV protection. Each frame has unique wood grain patterns.',
 'Clubmaster with genuine walnut wood browline',
 3100.00, 3800.00, 12, 3, 1, 2, 'Artisan', 'Wood/Metal', 'Browline', 'Walnut/Gold', 'unisex', 'Medium', 'active', true, false, false),

-- 21
('Infinity Progressive Lens Frame', 'infinity-progressive-lens-frame', 'VEC-RX-006',
 'Designed specifically for progressive lens wearers. Tall lens height ensures smooth transition zones between distance, intermediate, and reading areas. Lightweight titanium frame in a refined rectangular shape. Silicone-lined temples prevent slipping.',
 'Optimized frame for progressive lens wearers',
 2900.00, NULL, 35, 5, 2, 7, 'Infinity', 'Titanium', 'Rectangle', 'Dark Grey', 'unisex', 'Large', 'active', false, false, false),

-- 22
('Sporty Kids Wraparound', 'sporty-kids-wraparound', 'VEC-KID-003',
 'Active-lifestyle kids sunglasses with a secure wraparound design. Shatterproof polycarbonate lenses meet ANSI Z87.1 safety standards. Integrated strap keeps glasses secure during sports. Available in multiple vibrant color options.',
 'Shatterproof wraparound sunglasses for active kids',
 1100.00, 1400.00, 45, 10, 7, 16, 'ActiveKids', 'Polycarbonate', 'Wrap', 'Blue/Green', 'kids', 'Small', 'active', false, false, true),

-- 23
('DuoFlex Bifocal Reader', 'duoflex-bifocal-reader', 'VEC-RX-007',
 'Comfortable bifocal reading glasses with a visible D-segment lens area. Lightweight plastic frame with flexible temples. The rounded rectangular shape provides a wide field of view for both distance and reading. Available in multiple diopter strengths.',
 'Comfortable bifocal readers with flexible frame',
 1350.00, 1600.00, 55, 10, 2, 6, 'DuoFlex', 'Plastic', 'Rectangle', 'Havana', 'unisex', 'Medium', 'active', false, false, false),

-- 24
('Luxe Geometric Rose', 'luxe-geometric-rose', 'VEC-SUN-011',
 'Contemporary geometric sunglasses in a stunning rose-tinted design. Angular hexagonal shape stands out from the crowd. Premium CR-39 lenses with anti-scratch coating. Designed for those who see eyewear as a fashion statement rather than a necessity.',
 'Bold geometric hexagonal sunglasses in rose',
 2650.00, 3200.00, 20, 5, 5, 12, 'Luxe', 'Acetate', 'Geometric', 'Rose', 'women', 'Medium', 'active', false, false, true);

-- ============================================
-- PRODUCT TAGS (assign tags to products)
-- ============================================
INSERT INTO product_tags (product_id, tag_id) VALUES
  -- Classic Aviator: Best Seller, Polarized, UV Protection
  (1, 3), (1, 7), (1, 8),
  -- Urban Wayfarer: Best Seller, UV Protection
  (2, 3), (2, 8),
  -- Retro Round: New, Lightweight
  (3, 1), (3, 6),
  -- ProSport Wrap: New, UV Protection
  (4, 1), (4, 8),
  -- Cat Eye: Premium, Trending
  (5, 4), (5, 2),
  -- ClearView Rx: Best Seller, Lightweight
  (6, 3), (6, 6),
  -- Harmony Oval: New, Premium
  (7, 1), (7, 4),
  -- Executive Half-Rim: Best Seller
  (8, 3),
  -- FlexiKids: New, Lightweight
  (9, 1), (9, 6),
  -- DigitalShield: Best Seller, Trending
  (10, 3), (10, 2),
  -- GameDrishti: New, Trending
  (11, 1), (11, 2),
  -- Zenith Rimless: Premium, Lightweight
  (12, 4), (12, 6),
  -- Boulevard: New, Trending
  (13, 1), (13, 2),
  -- Titan Sport: UV Protection, Polarized
  (14, 8), (14, 7),
  -- Luna Butterfly: Best Seller, Premium
  (15, 3), (15, 4),
  -- Scholar Classic: Best Seller
  (16, 3),
  -- AeroLite Pilot: New, Premium
  (17, 1), (17, 4),
  -- Pixie Mini: New, Lightweight
  (18, 1), (18, 6),
  -- NightDrive: Polarized
  (19, 7),
  -- Vintage Clubmaster: Premium, Trending
  (20, 4), (20, 2),
  -- Infinity Progressive: Lightweight
  (21, 6),
  -- Sporty Kids: New, UV Protection
  (22, 1), (22, 8),
  -- DuoFlex Bifocal: Sale
  (23, 5),
  -- Luxe Geometric: New, Trending
  (24, 1), (24, 2);

-- ============================================
-- COUPONS (sample)
-- ============================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, is_active, expires_at) VALUES
  ('DRISHTI20',   'Get 20% off your first order',       'percentage', 20.00, 1000.00, 500.00,  100, true, NOW() + INTERVAL '6 months'),
  ('WELCOME10',  'Welcome discount — 10% off',         'percentage', 10.00, 500.00,  300.00,  200, true, NOW() + INTERVAL '3 months'),
  ('FLAT500',    'Flat ৳500 off on orders above ৳3000', 'fixed',      500.00, 3000.00, NULL,    50,  true, NOW() + INTERVAL '1 month');

-- ============================================
-- ADMIN USER (password: Admin@123)
-- Hash generated with bcryptjs, 10 salt rounds
-- CHANGE THIS PASSWORD BEFORE PRODUCTION
-- ============================================
-- Note: The admin account is created by the seed script (run-seed.js)
-- because the password hash must be generated at runtime with bcryptjs.

-- ============================================
-- DONE
-- ============================================
-- Seed data inserted successfully.
