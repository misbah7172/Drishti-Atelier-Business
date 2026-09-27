/**
 * Drishti — Database Setup Script
 * 
 * Runs schema.sql and seed.sql against the Neon PostgreSQL database,
 * then creates the admin user with a hashed password.
 * 
 * Usage: node database/setup.js
 */

const path = require('path');
const fs = require('fs');

// Resolve modules from server/node_modules
const serverDir = path.join(__dirname, '..', 'server');
const dotenv = require(path.join(serverDir, 'node_modules', 'dotenv'));
const pg = require(path.join(serverDir, 'node_modules', 'pg'));
const bcrypt = require(path.join(serverDir, 'node_modules', 'bcryptjs'));

// Load env from server/.env
dotenv.config({ path: path.join(serverDir, '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();

  try {
    console.log('\n🔧 Drishti — Database Setup\n');

    // 1. Run schema.sql
    console.log('📋 Step 1: Running schema.sql ...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSQL);
    console.log('   ✅ Schema created successfully.\n');

    // 2. Run seed.sql
    console.log('🌱 Step 2: Running seed.sql ...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await client.query(seedSQL);
    console.log('   ✅ Seed data inserted successfully.\n');

    // 3. Create admin user
    console.log('👤 Step 3: Creating admin user ...');
    const adminPassword = 'Admin@123';
    const hash = await bcrypt.hash(adminPassword, 10);

    await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin', 'admin@drishtiatelier.com', '+8801700000000', hash, 'admin']
    );
    console.log('   ✅ Admin user created.');
    console.log('      Email:    admin@drishtiatelier.com');
    console.log('      Password: Admin@123');
    console.log('      ⚠️  Change this password before production!\n');

    // 4. Create a sample customer
    console.log('👤 Step 4: Creating sample customer ...');
    const custHash = await bcrypt.hash('Customer@123', 10);
    await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['Rahim Ahmed', 'rahim@example.com', '+8801711111111', custHash, 'customer']
    );
    console.log('   ✅ Sample customer created.');
    console.log('      Email:    rahim@example.com');
    console.log('      Password: Customer@123\n');

    // 5. Verify counts
    console.log('📊 Step 5: Verification ...');
    const counts = await Promise.all([
      client.query('SELECT COUNT(*) FROM users'),
      client.query('SELECT COUNT(*) FROM categories'),
      client.query('SELECT COUNT(*) FROM subcategories'),
      client.query('SELECT COUNT(*) FROM products'),
      client.query('SELECT COUNT(*) FROM tags'),
      client.query('SELECT COUNT(*) FROM product_tags'),
      client.query('SELECT COUNT(*) FROM coupons'),
    ]);

    console.log(`   Users:         ${counts[0].rows[0].count}`);
    console.log(`   Categories:    ${counts[1].rows[0].count}`);
    console.log(`   Subcategories: ${counts[2].rows[0].count}`);
    console.log(`   Products:      ${counts[3].rows[0].count}`);
    console.log(`   Tags:          ${counts[4].rows[0].count}`);
    console.log(`   Product Tags:  ${counts[5].rows[0].count}`);
    console.log(`   Coupons:       ${counts[6].rows[0].count}`);

    // 6. Test a join query
    console.log('\n🔗 Step 6: Testing relationships ...');
    const joinTest = await client.query(`
      SELECT p.name AS product, c.name AS category, s.name AS subcategory
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LIMIT 5
    `);
    joinTest.rows.forEach((row) => {
      console.log(`   ${row.product} → ${row.category} → ${row.subcategory || 'N/A'}`);
    });

    console.log('\n✅ Database setup complete!\n');

  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
