require('dotenv').config();
const { Pool } = require('pg');

// Create connection pool using Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
});

// Listen for pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database pool error:', err);
});

/**
 * Execute a SQL query with parameterized values
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const start = Date.now();
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV !== 'production') {
        console.log('📊 Query:', { text: text.substring(0, 80), duration: `${duration}ms`, rows: result.rowCount });
      }
      return result;
    } catch (error) {
      const isTransient =
        error.message?.includes('socket disconnected') ||
        error.message?.includes('connection timeout') ||
        error.message?.includes('Connection terminated');

      if (isTransient && attempt < retries) {
        console.warn(`⚠️ Transient DB error on attempt ${attempt}, retrying in 500ms...`);
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      console.error('❌ Query error:', { text: text.substring(0, 80), error: error.message });
      throw error;
    }
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<import('pg').PoolClient>}
 */
async function getClient() {
  const client = await pool.connect();
  return client;
}

/**
 * Test the database connection with retry
 */
async function testConnection(retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await pool.query('SELECT NOW() AS current_time');
      console.log('✅ Database connected successfully');
      console.log(`   Time: ${result.rows[0].current_time}`);
      return true;
    } catch (error) {
      if (attempt === retries) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
      }
      console.log(`⏳ Database waking up, retry ${attempt}/${retries}...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
};
