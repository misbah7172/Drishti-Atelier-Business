const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// ------------------------------------
// Security & Middleware
// ------------------------------------
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, uptime/health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any localhost or 127.0.0.1 port (for local development)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // Allow any onrender.com or vercel.app deployment
      if (origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ------------------------------------
// Static Files (for uploads if needed)
// ------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------------
// Root & OAuth Redirect Handler
// ------------------------------------
app.get('/', (req, res, next) => {
  if (req.query.code || req.query.error) {
    const authController = require('./controllers/authController');
    return authController.handleGoogleRedirect(req, res, next);
  }
  res.json({
    status: 'ok',
    message: 'Drishti API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ------------------------------------
// Health Check (Supports both /health and /api/health for Render)
// ------------------------------------
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'drishti-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};

app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 500 : 30,
  message: { status: 'fail', message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false });

// API Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/products', apiLimiter, require('./routes/products'));
app.use('/api/categories', apiLimiter, require('./routes/categories'));
app.use('/api/cart', apiLimiter, require('./routes/cart'));
app.use('/api/wishlist', apiLimiter, require('./routes/wishlist'));
app.use('/api/orders', apiLimiter, require('./routes/orders'));
app.use('/api/addresses', apiLimiter, require('./routes/addresses'));
app.use('/api/admin', apiLimiter, require('./routes/admin'));
app.use('/api', apiLimiter, require('./routes/public'));

// ------------------------------------
// 404 Handler
// ------------------------------------
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ------------------------------------
// Global Error Handler
// ------------------------------------
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

module.exports = app;
