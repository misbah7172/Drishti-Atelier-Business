const jwt = require('jsonwebtoken');
const { query } = require('../db/pool');

/**
 * Middleware to authenticate requests using JWT
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Access denied. No authentication token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vision-eye-care-dev-secret-key-2026');

    // Fetch latest user info from DB
    const result = await query(
      'SELECT id, name AS full_name, name, email, phone, role, is_active, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token signature.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Failed to authenticate token.',
    });
  }
}

/**
 * Optional authentication: attaches req.user if token present, but doesn't block unauthenticated requests
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vision-eye-care-dev-secret-key-2026');
    const result = await query(
      'SELECT id, name AS full_name, name, email, phone, role, is_active, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length > 0 && result.rows[0].is_active) {
      req.user = result.rows[0];
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
};
