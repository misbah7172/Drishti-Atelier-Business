/**
 * Drishti — CSV Product Import & Database Cleanup
 * 
 * Clears all test, mock, and hardcoded data from the database,
 * then imports all products from "asstes/DRISHTI - Produst List.csv".
 * 
 * Usage: node database/import-csv-products.js
 */

const path = require('path');
const fs = require('fs');

// Resolve modules from server/node_modules
const serverDir = path.join(__dirname, '..', 'server');
const dotenv = require(path.join(serverDir, 'node_modules', 'dotenv'));
const pg = require(path.join(serverDir, 'node_modules', 'pg'));

// Load env
dotenv.config({ path: path.join(serverDir, '.env') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// CSV Parser
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

// Brand Normalization
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
  const lowerModel = modelNo.toLowerCase();

  let categorySlug = 'prescription-glasses';
  let gender = 'unisex';

  if (lowerNote.includes('kids') || lowerMemo.includes('28no') || lowerMemo.includes('29no') || lowerMemo.includes('30no')) {
    categorySlug = 'kids';
    gender = 'kids';
  } else if (lowerMemo.includes('sports') || lowerNote.includes('sports') || brand.toLowerCase().includes('okley')) {
    categorySlug = 'sports';
    gender = 'unisex';
  } else if (lowerNote.includes('sunglass') || lowerNote.includes('snglass') || lowerMemo.includes('2no') || lowerMemo.includes('5no')) {
    categorySlug = 'sunglasses';
  } else if (lowerNote.includes('ladies') || lowerNote.includes('girl') || lowerMemo.includes('11no') || lowerMemo.includes('12no') || lowerMemo.includes('9no')) {
    categorySlug = 'prescription-glasses';
    gender = 'women';
  } else if (lowerNote.includes('boy') || lowerMemo.includes('18no') || lowerMemo.includes('19no') || lowerMemo.includes('14no')) {
    categorySlug = 'prescription-glasses';
    gender = 'men';
  } else if (lowerNote.includes('wooden') || lowerMemo.includes('8no')) {
    categorySlug = 'prescription-glasses';
    if (lowerNote.includes('women')) gender = 'women';
  }

  if (lowerNote.includes('girl') || lowerNote.includes('ladies') || lowerNote.includes('women')) {
    gender = 'women';
  } else if (lowerNote.includes('boy')) {
    gender = 'men';
  } else if (lowerNote.includes('kids')) {
    gender = 'kids';
  }

  return { categorySlug, gender };
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

async function run() {
  const client = await pool.connect();

  try {
    console.log('🚀 Drishti — Starting CSV Product Import & DB Cleanup\n');

    await client.query('BEGIN');

    // 1. CLEAR ALL MOCK / TEST DATA
    console.log('🧹 Step 1: Removing all mock, test, and hardcoded data...');
    await client.query('DELETE FROM order_status_history');
    await client.query('DELETE FROM coupon_usages');
    await client.query('DELETE FROM payments');
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM reviews');
    await client.query('DELETE FROM cart_items');
    await client.query('DELETE FROM wishlist_items');
    await client.query('DELETE FROM product_tags');
    await client.query('DELETE FROM product_images');
    await client.query('DELETE FROM products');
    await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    console.log('   ✅ All mock products, images, tags, orders, reviews & carts cleared.\n');

    // 2. ENSURE ALL REQUIRED CATEGORIES EXIST
    console.log('📂 Step 2: Ensuring categories and subcategories exist...');
    const categoriesToEnsure = [
      { name: 'Sunglasses', slug: 'sunglasses', desc: 'UV400 luxury & performance sunglasses', order: 1 },
      { name: 'Prescription Glasses', slug: 'prescription-glasses', desc: 'Precision optical frames for clear Drishti', order: 2 },
      { name: 'Sports Eyewear', slug: 'sports', desc: 'High-performance eyewear for athletics & active lifestyles', order: 3 },
      { name: 'Kids Eyewear', slug: 'kids', desc: 'Durable, safe, and flexible frames for children', order: 4 },
      { name: 'Blue Light Glasses', slug: 'blue-light-glasses', desc: 'Digital screen protection lenses', order: 5 },
      { name: 'Men', slug: 'men', desc: 'Curated eyewear for men', order: 6 },
      { name: 'Women', slug: 'women', desc: 'Curated eyewear for women', order: 7 },
      { name: 'Unisex', slug: 'unisex', desc: 'Universal designer frames for everyone', order: 8 },
    ];

    for (const cat of categoriesToEnsure) {
      await client.query(
        `INSERT INTO categories (name, slug, description, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order`,
        [cat.name, cat.slug, cat.desc, cat.order]
      );
    }

    const catRes = await client.query('SELECT id, slug FROM categories');
    const catMap = {};
    catRes.rows.forEach(r => { catMap[r.slug] = r.id; });
    console.log('   ✅ Categories verified:', Object.keys(catMap));

    // 3. READ AND PARSE CSV
    console.log('\n📄 Step 3: Reading CSV file...');
    const csvPath = path.join(__dirname, '..', 'asstes', 'DRISHTI - Produst List.csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    console.log(`   Found ${lines.length - 1} product rows in CSV.`);

    const usedSkus = new Set();
    const usedSlugs = new Set();
    let insertCount = 0;

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
      const localPrice = cols[8] ? parseFloat(cols[8]) : null;

      const brand = BRAND_MAP[rawBrand.trim()] || rawBrand.trim() || 'Drishti';
      const { categorySlug, gender } = determineCategoryAndGender(memoNo, note, rawModel, brand);
      const { frameColor, frameMaterial, frameShape } = extractDetails(rawModel, rawSize, note);

      // Unique SKU generation based on model number
      let cleanModel = rawModel.trim();
      if (!cleanModel || cleanModel.toLowerCase() === 'n/a') {
        cleanModel = `${brand.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-NA`;
      } else if (cleanModel.toLowerCase() === 'local') {
        cleanModel = `${brand.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-LOC`;
      }

      // Handle specific known duplicates cleanly
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

      // Size
      let size = rawSize.trim();
      const isDim = /^\d{2}-\d{2}/.test(size);
      if (!size || !isDim) {
        size = isDim ? size : 'Standard Fit';
      }

      // Product Name
      let cleanTitle = `${brand} ${rawModel.trim()}`;
      if (rawModel.trim().toLowerCase() === 'local') {
        cleanTitle = `${brand} Classic Local Eyewear`;
      } else if (rawModel.trim().toLowerCase() === 'n/a') {
        cleanTitle = `${brand} Signature Edition Eyewear`;
      } else if (cleanTitle.length < 16) {
        cleanTitle += ` ${categorySlug === 'sunglasses' || categorySlug === 'sports' ? 'Sunglasses' : 'Eyewear'}`;
      }

      // Unique Slug
      let slugBase = `${brand}-${cleanModel}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      let slug = slugBase;
      let sCounter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${slugBase}-${sCounter}`;
        sCounter++;
      }
      usedSlugs.add(slug);

      // Price & Compare Price
      const price = wholesalePrice;
      const comparePrice = Math.round(price * 1.35);

      // Category ID
      const categoryId = catMap[categorySlug] || catMap['prescription-glasses'];

      // Descriptions
      const shortDesc = `${brand} ${rawModel.trim()} featuring premium ${frameMaterial.toLowerCase()} construction in ${frameColor.toLowerCase()} finish.`;
      const desc = `Model: ${rawModel.trim()}\nBrand: ${brand}\nBatch Memo: ${memoNo}\nPackaging Box: ${box || 'Original Drishti Case'}\nFrame Color: ${frameColor}\nFrame Material: ${frameMaterial}\nFrame Shape: ${frameShape}\nDimensions / Size: ${size}\nCategory: ${categorySlug === 'sunglasses' ? 'Sunglasses' : categorySlug === 'sports' ? 'Sports Eyewear' : categorySlug === 'kids' ? 'Kids Collection' : 'Prescription / Optical Frames'}\n\nCrafted with meticulous attention to detail and optical clarity. Complete with Drishti Atelier authenticity guarantee.`;

      // Status & Flags
      const isFeatured = ['Ray-Ban', 'Tom Ford', 'Montblanc', 'Hermès', 'Oakley', 'Dior', 'Prada', 'Moscot'].includes(brand) && (i % 7 === 0);
      const isBestseller = ['Ray-Ban', 'Oakley', 'Moscot', 'Titan', 'Danmac'].includes(brand) || (i % 5 === 0);

      await client.query(
        `INSERT INTO products (
          name, slug, sku, description, short_description,
          price, compare_price, stock, low_stock_threshold,
          category_id, subcategory_id, brand, frame_material,
          frame_shape, frame_color, gender, size, status,
          featured, bestseller, new_arrival
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12, $13,
          $14, $15, $16, $17, $18,
          $19, $20, $21
        )`,
        [
          cleanTitle, slug, sku, desc, shortDesc,
          price, comparePrice, piece, 0,
          categoryId, null, brand, frameMaterial,
          frameShape, frameColor, gender, size, 'active',
          isFeatured, isBestseller, true
        ]
      );

      insertCount++;
    }

    await client.query('COMMIT');
    console.log(`\n🎉 Step 4: Successfully imported ${insertCount} products into database!`);

    // Verify
    const verifyProd = await client.query('SELECT COUNT(*) FROM products');
    const verifyImg = await client.query('SELECT COUNT(*) FROM product_images');
    console.log(`\n📊 Verification:`);
    console.log(`   Products in DB:     ${verifyProd.rows[0].count}`);
    console.log(`   Images in DB:       ${verifyImg.rows[0].count} (no images initially, as requested)`);

    const sample = await client.query('SELECT id, name, sku, price, stock, brand FROM products LIMIT 5');
    console.log('\n✨ First 5 Products in Database:');
    console.table(sample.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Import failed! Rolled back transaction:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(() => process.exit(1));
