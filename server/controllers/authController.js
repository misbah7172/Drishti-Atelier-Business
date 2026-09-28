const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db/pool');

/**
 * Generate JWT Token helper
 */
function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'vision-eye-care-dev-secret-key-2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
}

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { full_name, email, password, phone } = req.body;

    // Validation
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Email address is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ status: 'fail', message: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ status: 'fail', message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing email
    const existingUser = await query(
      'SELECT id FROM users WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'An account with this email address already exists.',
      });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const newUserResult = await query(
      `INSERT INTO users (name, email, password_hash, phone, role, is_active)
       VALUES ($1, $2, $3, $4, 'customer', true)
       RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at`,
      [full_name.trim(), cleanEmail, password_hash, phone ? phone.trim() : null]
    );

    const newUser = newUserResult.rows[0];
    const token = generateToken(newUser);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully!',
      token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * User login
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user in database
    const userResult = await query(
      `SELECT id, name AS full_name, name, email, password_hash, phone, role, is_active, created_at 
       FROM users WHERE LOWER(email) = $1`,
      [cleanEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password.',
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password.',
      });
    }

    // Update last login timestamp
    await query(
      'UPDATE users SET updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Remove password_hash from response object
    delete user.password_hash;

    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully!',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
async function getMe(req, res) {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
}

/**
 * User logout
 * POST /api/auth/logout
 */
async function logout(req, res) {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
}

module.exports = {
  register,
  login,
  getMe,
  logout,
};
