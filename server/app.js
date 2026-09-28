const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// ------------------------------------
// Security & Middleware
// ------------------------------------
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ------------------------------------
// Static Files (for uploads if needed)
// ------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------------------------
// Health Check
// ------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Drishti API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ------------------------------------
// API Routes (will be added per phase)
// ------------------------------------
app.use('/api/auth', require('./routes/auth'));
// Phase 4: app.use('/api/products', require('./routes/products'));
// Phase 4: app.use('/api/categories', require('./routes/categories'));
// Phase 5: app.use('/api/cart', require('./routes/cart'));
// Phase 5: app.use('/api/wishlist', require('./routes/wishlist'));
// Phase 6: app.use('/api/orders', require('./routes/orders'));
// Phase 9: app.use('/api/admin', require('./routes/admin'));

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
