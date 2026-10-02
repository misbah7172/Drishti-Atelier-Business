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

/**
 * Update user profile
 * PUT /api/auth/profile
 * Body: { name, email, phone }
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Name is required.' });
    }

    // If email changed, check uniqueness
    if (email && email.trim().toLowerCase() !== req.user.email.toLowerCase()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ status: 'fail', message: 'Invalid email address.' });
      }
      const existing = await query(
        'SELECT id FROM users WHERE LOWER(email) = $1 AND id != $2',
        [email.trim().toLowerCase(), userId]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ status: 'fail', message: 'Email already in use.' });
      }
    }

    const result = await query(
      `UPDATE users SET name = $1, email = $2, phone = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, name AS full_name, email, phone, role, is_active, created_at`,
      [name.trim(), (email || req.user.email).trim().toLowerCase(), phone || null, userId]
    );

    const updatedUser = result.rows[0];
    const token = generateToken(updatedUser);

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully.',
      token,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Change password
 * PUT /api/auth/password
 * Body: { current_password, new_password }
 */
async function changePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current password and new password are required.',
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        status: 'fail',
        message: 'New password must be at least 6 characters.',
      });
    }

    // Get current hash
    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    const isValid = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ status: 'fail', message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(new_password, salt);

    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);

    res.status(200).json({ status: 'success', message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
}

// -------------------------------------------------------------
// Google OAuth 2.0 Integration
// -------------------------------------------------------------
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000'
);

/**
 * Helper to verify Google ID token, Auth Code, or Access Token
 */
async function verifyGoogleTokenOrCode({ credential, code, access_token }) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  // Option 1: ID token / credential (from Google One Tap or Google Sign-In)
  if (credential) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    return {
      email: payload.email,
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      picture: payload.picture,
      googleId: payload.sub,
      emailVerified: payload.email_verified,
    };
  }

  // Option 2: Auth Code (exchanged for tokens on backend)
  if (code) {
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000',
    });
    googleClient.setCredentials(tokens);

    if (tokens.id_token) {
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      return {
        email: payload.email,
        name: payload.name || payload.given_name || payload.email.split('@')[0],
        picture: payload.picture,
        googleId: payload.sub,
        emailVerified: payload.email_verified,
      };
    }

    if (tokens.access_token) {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const data = await userInfoRes.json();
      return {
        email: data.email,
        name: data.name || data.email.split('@')[0],
        picture: data.picture,
        googleId: data.sub,
        emailVerified: data.email_verified,
      };
    }
  }

  // Option 3: Access token
  if (access_token) {
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const data = await userInfoRes.json();
    return {
      email: data.email,
      name: data.name || data.email.split('@')[0],
      picture: data.picture,
      googleId: data.sub,
      emailVerified: data.email_verified,
    };
  }

  return null;
}

/**
 * Handle Google authentication from frontend
 * POST /api/auth/google
 * Body: { credential, code, access_token }
 */
async function googleAuth(req, res, next) {
  try {
    const { credential, code, access_token } = req.body;

    if (!credential && !code && !access_token) {
      return res.status(400).json({
        status: 'fail',
        message: 'Google authentication credential or authorization code is required.',
      });
    }

    const googleUser = await verifyGoogleTokenOrCode({ credential, code, access_token });

    if (!googleUser || !googleUser.email) {
      return res.status(401).json({
        status: 'fail',
        message: 'Google authentication failed: unable to extract profile details from Google.',
      });
    }

    const cleanEmail = googleUser.email.trim().toLowerCase();

    // Look for existing user by email
    const userResult = await query(
      `SELECT id, name AS full_name, name, email, phone, role, is_active, created_at
       FROM users WHERE LOWER(email) = $1`,
      [cleanEmail]
    );

    let user;

    if (userResult.rows.length > 0) {
      user = userResult.rows[0];

      if (!user.is_active) {
        return res.status(403).json({
          status: 'fail',
          message: 'Your account has been deactivated. Please contact support.',
        });
      }

      // Update timestamp
      await query('UPDATE users SET updated_at = NOW() WHERE id = $1', [user.id]);
    } else {
      // Create new customer account with random secure password hash satisfying NOT NULL constraint
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(randomPassword, saltRounds);

      const newUserResult = await query(
        `INSERT INTO users (name, email, password_hash, role, is_active)
         VALUES ($1, $2, $3, 'customer', true)
         RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at`,
        [googleUser.name.trim(), cleanEmail, password_hash]
      );

      user = newUserResult.rows[0];
    }

    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      message: 'Logged in with Google successfully!',
      token,
      user,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({
      status: 'fail',
      message: error.message || 'Google authentication failed.',
    });
  }
}

/**
 * Generate Google OAuth 2.0 redirect URL
 * GET /api/auth/google/url
 */
function getGoogleAuthUrl(req, res) {
  try {
    const url = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'profile', 'email'],
      prompt: 'select_account',
    });

    res.status(200).json({
      status: 'success',
      url,
      data: { url },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate Google auth URL.',
    });
  }
}

/**
 * Handle Google OAuth redirect callback
 * GET /api/auth/google/callback OR GET /?code=...
 */
async function handleGoogleRedirect(req, res, next) {
  try {
    const { code, error } = req.query;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (error) {
      return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${clientUrl}/auth/callback?error=no_code_provided`);
    }

    const googleUser = await verifyGoogleTokenOrCode({ code });

    if (!googleUser || !googleUser.email) {
      return res.redirect(`${clientUrl}/auth/callback?error=google_auth_failed`);
    }

    const cleanEmail = googleUser.email.trim().toLowerCase();
    const userResult = await query(
      `SELECT id, name AS full_name, name, email, phone, role, is_active, created_at
       FROM users WHERE LOWER(email) = $1`,
      [cleanEmail]
    );

    let user;
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      if (!user.is_active) {
        return res.redirect(`${clientUrl}/auth/callback?error=account_deactivated`);
      }
      await query('UPDATE users SET updated_at = NOW() WHERE id = $1', [user.id]);
    } else {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const password_hash = await bcrypt.hash(randomPassword, 10);

      const newUserResult = await query(
        `INSERT INTO users (name, email, password_hash, role, is_active)
         VALUES ($1, $2, $3, 'customer', true)
         RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at`,
        [googleUser.name.trim(), cleanEmail, password_hash]
      );
      user = newUserResult.rows[0];
    }

    const token = generateToken(user);
    return res.redirect(`${clientUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error('Google Redirect Error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(error.message || 'oauth_error')}`);
  }
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
  googleAuth,
  getGoogleAuthUrl,
  handleGoogleRedirect,
};
