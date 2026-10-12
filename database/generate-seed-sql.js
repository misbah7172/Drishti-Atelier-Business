const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'asstes', 'DRISHTI - Produst List.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const BRAND_MAP = {
  'NON BRAND': 'Non-Brand',
  'HERMES': 'Hermès',
  'OKLEY(USA)': 'Oakley',
  'Okley (USA)': 'Oakley',
  'CONPOLSHE': 'Conpolshe',
  'Versace': 'Versace',
  'DIOR': 'Dior',
  'Dior': 'Dior',
  'Prada': 'Prada',
  'Tom Ford': 'Tom Ford',
  'Ra-yban': 'Ray-Ban',
  'Ray ban': 'Ray-Ban',
  'Maybach': 'Maybach',
  'Moscot': 'Moscot',
  'Marc-Jacobs': 'Marc Jacobs',
  'Balmain': 'Balmain',
  'Balmainn': 'Balmain',
  'Dita': 'Dita',
  'Louis Vuttion': 'Louis Vuitton',
  'Louis Vuttion ': 'Louis Vuitton',
  'Danmac': 'Danmac',
  'Smeir': 'Smeir',
  'Porsche': 'Porsche Design',
  'Chihao': 'Chihao',
  'Diyiyan': 'Diyiyan',
  'Proya': 'Proya',
  'ESCAPE': 'Escape',
  'Charmant': 'Charmant',
  'OffWhite': 'Off-White',
  'Celine': 'Celine',
  'Armani': 'Giorgio Armani',
  'Burberry': 'Burberry',
  'Podcast': 'Podcast',
  'Titan': 'Titan',
  'Balenciaga': 'Balenciaga',
  'Monk Blanc': 'Montblanc',
  'MIU MIU': 'Miu Miu',
  'Local': 'Local Atelier',
  'Tiffany': 'Tiffany & Co.',
  'Adidas': 'Adidas',
  'Hugo Boss': 'Hugo Boss',
  'Nucey': 'Nucey',
};

function determineCategoryAndGender(memoNo, note, modelNo, brand) {
  const lowerMemo = memoNo.toLowerCase();
  const lowerNote = note.toLowerCase();
  let categoryId = 2; // Prescription Glasses default
  let gender = 'unisex';

  if (lowerNote.includes('kids') || lowerMemo.includes('28no') || lowerMemo.includes('29no') || lowerMemo.includes('30no')) {
    categoryId = 7; // Kids
    gender = 'kids';
  } else if (lowerMemo.includes('sports') || lowerNote.includes('sports') || brand.toLowerCase().includes('okley')) {
    categoryId = 8; // Sports Eyewear
    gender = 'unisex';
  } else if (lowerNote.includes('sunglass') || lowerNote.includes('snglass') || lowerMemo.includes('2no') || lowerMemo.includes('5no')) {
    categoryId = 1; // Sunglasses
  } else if (lowerNote.includes('ladies') || lowerNote.includes('girl') || lowerMemo.includes('11no') || lowerMemo.includes('12no') || lowerMemo.includes('9no')) {
    categoryId = 5; // Women
    gender = 'women';
  } else if (lowerNote.includes('boy') || lowerMemo.includes('18no') || lowerMemo.includes('19no') || lowerMemo.includes('14no')) {
    categoryId = 4; // Men
    gender = 'men';
  }

  if (lowerNote.includes('girl') || lowerNote.includes('ladies') || lowerNote.includes('women')) {
    gender = 'women';
  } else if (lowerNote.includes('boy')) {
    gender = 'men';
  } else if (lowerNote.includes('kids')) {
    gender = 'kids';
  }

  return { categoryId, gender };
}

function extractDetails(modelNo, size, note) {
  let frameColor = 'Classic Black';
  let frameMaterial = 'Premium Acetate';
  let frameShape = 'Rectangle';

  const combined = (modelNo + ' ' + size + ' ' + note).toLowerCase();

  if (combined.includes('tiger black')) frameColor = 'Tiger Black';
  else if (combined.includes('glossy black')) frameColor = 'Glossy Black';
  else if (combined.includes('mad black') || combined.includes('mat black') || combined.includes('matt black')) frameColor = 'Matte Black';
  else if (combined.includes('transparent black') || combined.includes('trans black') || combined.includes('transprent black')) frameColor = 'Transparent Black';
  else if (combined.includes('black golden') || combined.includes('gold strip')) frameColor = 'Black & Gold';
  else if (combined.includes('black&white')) frameColor = 'Black & White';
  else if (combined.includes('purple black')) frameColor = 'Purple & Black';
  else if (combined.includes('black')) frameColor = 'Black';
  else if (combined.includes('transparent pink') || combined.includes('trans pink')) frameColor = 'Transparent Pink';
  else if (combined.includes('blown pink') || combined.includes('baby pink') || combined.includes('pink white') || combined.includes('pink')) frameColor = 'Pink';
  else if (combined.includes('trans brown')) frameColor = 'Transparent Brown';
  else if (combined.includes('glossy brown') || combined.includes('brown')) frameColor = 'Brown';
  else if (combined.includes('gray golden') || combined.includes('graygolden')) frameColor = 'Gray & Gold';
  else if (combined.includes('glossy gray') || combined.includes('gray') || combined.includes('grey')) frameColor = 'Gray';
  else if (combined.includes('orange') || combined.includes('trans orange')) frameColor = 'Orange';
  else if (combined.includes('blue') || combined.includes('glossy blue')) frameColor = 'Blue';
  else if (combined.includes('cyan')) frameColor = 'Cyan';
  else if (combined.includes('purple')) frameColor = 'Purple';
  else if (combined.includes('green')) frameColor = 'Green';
  else if (combined.includes('red-black')) frameColor = 'Red & Black';
  else if (combined.includes('red flower')) frameColor = 'Red Floral';
  else if (combined.includes('red')) frameColor = 'Red';
  else if (combined.includes('wooden olive')) frameColor = 'Olive Wood';
  else if (combined.includes('wooden glossy t black') || combined.includes('wooden glossy black')) frameColor = 'Glossy Black Wood';
  else if (combined.includes('wooden glossy white')) frameColor = 'Glossy White Wood';
  else if (combined.includes('wooden trans matt')) frameColor = 'Translucent Matte Wood';
  else if (combined.includes('wooden t white matt')) frameColor = 'White Matte Wood';
  else if (combined.includes('wooden')) frameColor = 'Natural Wood';
  else if (combined.includes('gold') || combined.includes('golden')) frameColor = 'Gold';
  else if (combined.includes('transparent') || combined.includes('clear')) frameColor = 'Transparent Crystal';

  if (combined.includes('wood')) frameMaterial = 'Natural Wood';
  else if (combined.includes('tr90')) frameMaterial = 'TR90 Ultra-Flex Nylon';
  else if (combined.includes('metal') || combined.includes('gold strip')) frameMaterial = 'Stainless Steel / Alloy';
  else if (combined.includes('sports')) frameMaterial = 'Impact-Resistant Polycarbonate';
  else frameMaterial = 'Handcrafted Acetate';

  if (combined.includes('round')) frameShape = 'Round';
  else if (combined.includes('square')) frameShape = 'Square';
  else if (combined.includes('rectangle')) frameShape = 'Rectangle';
  else if (combined.includes('wayfarer') || combined.includes('rb2140')) frameShape = 'Wayfarer';
  else if (combined.includes('aviator')) frameShape = 'Aviator';
  else if (combined.includes('cat eye') || combined.includes('cateye')) frameShape = 'Cat Eye';
  else if (combined.includes('oval')) frameShape = 'Oval';
  else frameShape = 'Geometric';

  return { frameColor, frameMaterial, frameShape };
}

function sqlEscape(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

let sql = `-- ============================================
-- Drishti — Seed Data (Real CSV Product Catalog)
-- ============================================
-- Run AFTER schema.sql
-- Usage: node database/setup.js
-- ============================================

-- ============================================
-- CATEGORIES (8)
-- ============================================
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  (1, 'Sunglasses',          'sunglasses',          'UV400 luxury & performance sunglasses',          1),
  (2, 'Prescription Glasses','prescription-glasses', 'Precision optical frames for clear Drishti',    2),
  (3, 'Blue Light Glasses',  'blue-light-glasses',  'Protect your eyes from digital screen glare',     3),
  (4, 'Men',                 'men',                 'Eyewear designed for men',                       4),
  (5, 'Women',               'women',               'Eyewear designed for women',                     5),
  (6, 'Unisex',              'unisex',              'Eyewear for everyone',                           6),
  (7, 'Kids',                'kids',                'Safe, flexible, and durable eyewear for kids',   7),
  (8, 'Sports Eyewear',      'sports',              'High-performance eyewear for athletics & outdoor',8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

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
  ('UV Protection','uv-protection')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PRODUCTS (108 Products from CSV Catalog)
-- ============================================
`;

const usedSkus = new Set();
const usedSlugs = new Set();

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  const memoNo = cols[0] || '';
  const piece = parseInt(cols[1]) || 1;
  const rawModel = cols[2] || '';
  const rawSize = cols[3] || '';
  const note = cols[4] || '';
  const rawBrand = cols[5] || '';
  const box = cols[6] || '';
  const wholesalePrice = parseFloat(cols[7]) || 0;

  const brand = BRAND_MAP[rawBrand.trim()] || rawBrand.trim() || 'Drishti';
  const { categoryId, gender } = determineCategoryAndGender(memoNo, note, rawModel, brand);
  const { frameColor, frameMaterial, frameShape } = extractDetails(rawModel, rawSize, note);

  let cleanModel = rawModel.trim();
  if (!cleanModel || cleanModel.toLowerCase() === 'n/a') {
    cleanModel = `${brand.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-NA`;
  } else if (cleanModel.toLowerCase() === 'local') {
    cleanModel = `${brand.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-LOC`;
  }

  let skuCandidate = cleanModel.replace(/[\(\)\/\s]+/g, '-').replace(/^-+|-+$/g, '');
  if (cleanModel === '1181') {
    const colorSuffix = (rawSize || 'SPORT').toUpperCase().replace(/[^A-Z]/g, '');
    skuCandidate = `1181-${colorSuffix}`;
  }
  if (skuCandidate.length > 45) {
    skuCandidate = skuCandidate.substring(0, 45);
  }

  let sku = skuCandidate;
  let counter = 1;
  while (usedSkus.has(sku.toUpperCase())) {
    sku = `${skuCandidate}-${counter}`;
    counter++;
  }
  usedSkus.add(sku.toUpperCase());

  let size = rawSize.trim();
  const isDim = /^\d{2}-\d{2}/.test(size);
  if (!size || !isDim) {
    size = isDim ? size : 'Standard Fit';
  }

  let cleanTitle = `${brand} ${rawModel.trim()}`;
  if (rawModel.trim().toLowerCase() === 'local') {
    cleanTitle = `${brand} Classic Local Eyewear`;
  } else if (rawModel.trim().toLowerCase() === 'n/a') {
    cleanTitle = `${brand} Signature Edition Eyewear`;
  } else if (cleanTitle.length < 16) {
    cleanTitle += ' Eyewear';
  }

  let slugBase = `${brand}-${cleanModel}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  let slug = slugBase;
  let sCounter = 1;
  while (usedSlugs.has(slug)) {
    slug = `${slugBase}-${sCounter}`;
    sCounter++;
  }
  usedSlugs.add(slug);

  const price = wholesalePrice;
  const comparePrice = Math.round(price * 1.35);

  const shortDesc = `${brand} ${rawModel.trim()} in ${frameColor.toLowerCase()} finish.`;
  const desc = `Model: ${rawModel.trim()}\\nBrand: ${brand}\\nBatch Memo: ${memoNo}\\nBox: ${box || 'Original Case'}\\nColor: ${frameColor}\\nMaterial: ${frameMaterial}\\nSize: ${size}\\nAuthentic Drishti Atelier piece.`;

  const isFeatured = ['Ray-Ban', 'Tom Ford', 'Montblanc', 'Hermès', 'Oakley', 'Dior'].includes(brand) && (i % 7 === 0);
  const isBestseller = ['Ray-Ban', 'Oakley', 'Moscot', 'Titan'].includes(brand) || (i % 5 === 0);

  sql += `INSERT INTO products (name, slug, sku, description, short_description, price, compare_price, stock, low_stock_threshold, category_id, brand, frame_material, frame_shape, frame_color, gender, size, status, featured, bestseller, new_arrival) VALUES
  (${sqlEscape(cleanTitle)}, ${sqlEscape(slug)}, ${sqlEscape(sku)}, ${sqlEscape(desc)}, ${sqlEscape(shortDesc)}, ${price.toFixed(2)}, ${comparePrice.toFixed(2)}, ${piece}, 0, ${categoryId}, ${sqlEscape(brand)}, ${sqlEscape(frameMaterial)}, ${sqlEscape(frameShape)}, ${sqlEscape(frameColor)}, ${sqlEscape(gender)}, ${sqlEscape(size)}, 'active', ${isFeatured}, ${isBestseller}, true);\n\n`;
}

sql += `-- ============================================
-- COUPONS (sample)
-- ============================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, is_active, expires_at) VALUES
  ('DRISHTI20',   'Get 20% off your first order',       'percentage', 20.00, 1000.00, 500.00,  100, true, NOW() + INTERVAL '6 months'),
  ('WELCOME10',  'Welcome discount — 10% off',         'percentage', 10.00, 500.00,  300.00,  200, true, NOW() + INTERVAL '3 months'),
  ('FLAT500',    'Flat ৳500 off on orders above ৳3000', 'fixed',      500.00, 3000.00, NULL,    50,  true, NOW() + INTERVAL '1 month')
ON CONFLICT (code) DO NOTHING;
`;

fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql, 'utf8');
console.log('✅ Updated database/seed.sql with all 108 CSV products!');
