const bcrypt = require('bcryptjs');
const { query } = require('../db/pool');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new customer account
 * @route   POST /api/auth/register
 * @access  Public
 */
async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    // ── Validate required fields ──
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required.',
      });
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must be between 2 and 100 characters.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address.',
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long.',
      });
    }

    // ── Check for duplicate email ──
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists.',
      });
    }

    // ── Hash password ──
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ── Insert user ──
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING id, name, email, phone, role, is_active, created_at`,
      [name.trim(), email.toLowerCase().trim(), phone?.trim() || null, passwordHash]
    );

    const user = result.rows[0];

    // ── Generate JWT ──
    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again.',
    });
  }
}

/**
 * @desc    Login user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // ── Validate required fields ──
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required.',
      });
    }

    // ── Find user by email ──
    const result = await query(
      'SELECT id, name, email, phone, password_hash, role, is_active, created_at FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    const user = result.rows[0];

    // ── Check if account is active ──
    if (!user.is_active) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been disabled. Contact support.',
      });
    }

    // ── Compare password ──
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    // ── Generate JWT ──
    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_active: user.is_active,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.',
    });
  }
}

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Protected (token required)
 */
async function getMe(req, res) {
  try {
    // req.user is set by auth middleware
    const result = await query(
      'SELECT id, name, email, phone, role, is_active, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: result.rows[0],
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user profile.',
    });
  }
}

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Protected (token required)
 */
async function logout(req, res) {
  // JWT is stateless — logout is handled client-side by removing the token.
  // This endpoint exists for consistency and can be extended with token blacklisting later.
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
