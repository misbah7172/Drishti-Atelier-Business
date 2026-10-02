require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./db/pool');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    // Test database connection
    await testConnection();

    app.listen(PORT, HOST, () => {
      console.log(`\n🚀 Drishti Atelier API Server`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port: ${PORT}`);
      console.log(`   Host: ${HOST}`);
      console.log(`   URL: http://${HOST}:${PORT}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
