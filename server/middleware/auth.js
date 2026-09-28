const jwt = require('jsonwebtoken');
const { query } = require('../db/pool');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to req
 */
async function auth(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please login again.',
        });
      }
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token.',
      });
    }

    // Fetch user from database to ensure they still exist and are active
    const result = await query(
      'SELECT id, name, email, phone, role, is_active, created_at, updated_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists.',
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been disabled. Contact support.',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error.',
    });
  }
}

module.exports = auth;
