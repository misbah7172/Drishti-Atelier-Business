const app = require('../server/app');

// Vercel Serverless Function entry point
// Bridges Vercel serverless request handling with the Express application
module.exports = (req, res) => {
  // Ensure req.url retains /api prefix if Vercel strips it during edge routing
  if (!req.url.startsWith('/api') && !req.url.startsWith('/health')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};
