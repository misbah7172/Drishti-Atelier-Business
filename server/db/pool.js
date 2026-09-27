const { Pool } = require('pg');

// Create connection pool using Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
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
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log('📊 Query:', { text: text.substring(0, 80), duration: `${duration}ms`, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('❌ Query error:', { text: text.substring(0, 80), error: error.message });
    throw error;
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
 * Test the database connection
 */
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    console.log('✅ Database connected successfully');
    console.log(`   Time: ${result.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
};
