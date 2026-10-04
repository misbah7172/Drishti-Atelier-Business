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

    // If phone is provided, check existing phone
    if (phone && phone.trim()) {
      const cleanPhone = phone.trim();
      const phoneDigits = cleanPhone.replace(/\D/g, '');
      const existingPhone = await query(
        `SELECT id FROM users 
         WHERE phone = $1 
            OR (phone IS NOT NULL AND length($2) >= 7 AND regexp_replace(phone, '\\D', '', 'g') = $2)`,
        [cleanPhone, phoneDigits]
      );
      if (existingPhone.rows.length > 0) {
        return res.status(400).json({
          status: 'fail',
          message: 'An account with this phone number already exists.',
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const newUserResult = await query(
      `INSERT INTO users (name, email, password_hash, phone, role, is_active, auth_provider)
       VALUES ($1, $2, $3, $4, 'customer', true, 'local')
       RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at, avatar_url, auth_provider`,
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
 * User login (supports Email OR Phone number)
 * POST /api/auth/login
 * Body: { identifier, email, phone, password }
 */
async function login(req, res, next) {
  try {
    const { email, phone, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || phone || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email or phone number, and password.',
      });
    }

    const cleanIdentifier = loginIdentifier.toLowerCase();
    const digitsOnly = loginIdentifier.replace(/\D/g, '');

    // Find user in database by email, exact phone, or stripped digits phone
    const userResult = await query(
      `SELECT id, name AS full_name, name, email, password_hash, phone, role, is_active, created_at, avatar_url, google_id, auth_provider 
       FROM users 
       WHERE LOWER(email) = $1 
          OR phone = $2 
          OR (phone IS NOT NULL AND length($3) >= 7 AND regexp_replace(phone, '\\D', '', 'g') = $3)
       LIMIT 1`,
      [cleanIdentifier, loginIdentifier, digitsOnly]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email/phone number or password.',
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check if user registered via Google OAuth without setting a password
    if (!user.password_hash) {
      return res.status(400).json({
        status: 'fail',
        message: 'This account was registered using Google Sign-In. Please click Continue with Google.',
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email/phone number or password.',
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
async function verifyGoogleTokenOrCode({ credential, code, access_token, redirect_uri }) {
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
  // @react-oauth/google popup flow requires redirect_uri = 'postmessage'.
  // Server-side redirect flow requires the actual GOOGLE_REDIRECT_URI.
  // We try the primary URI first, then fallback to the other.
  if (code) {
    const primaryRedirectUri = redirect_uri || 'postmessage';
    let tokens;

    try {
      const res = await googleClient.getToken({
        code,
        redirect_uri: primaryRedirectUri,
      });
      tokens = res.tokens;
    } catch (primaryErr) {
      console.warn(`Google token exchange with redirect_uri "${primaryRedirectUri}" failed:`, primaryErr.message);

      const fallbackUri = primaryRedirectUri === 'postmessage'
        ? (process.env.GOOGLE_REDIRECT_URI || 'https://drishti-atelier-business.onrender.com')
        : 'postmessage';

      try {
        const res = await googleClient.getToken({
          code,
          redirect_uri: fallbackUri,
        });
        tokens = res.tokens;
      } catch (fallbackErr) {
        console.error('All Google token exchange attempts failed:', {
          primary: primaryErr.message,
          fallback: fallbackErr.message,
        });
        throw new Error(`Google token exchange failed: ${primaryErr.message}`);
      }
    }

    googleClient.setCredentials(tokens);

    if (tokens.id_token) {
      try {
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
      } catch (verifyErr) {
        console.warn('verifyIdToken failed, falling back to access_token:', verifyErr.message);
      }
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
    const { credential, code, access_token, redirect_uri } = req.body;

    if (!credential && !code && !access_token) {
      return res.status(400).json({
        status: 'fail',
        message: 'Google authentication credential or authorization code is required.',
      });
    }

    const googleUser = await verifyGoogleTokenOrCode({ credential, code, access_token, redirect_uri });

    if (!googleUser || !googleUser.email) {
      return res.status(401).json({
        status: 'fail',
        message: 'Google authentication failed: unable to extract profile details from Google.',
      });
    }

    const cleanEmail = googleUser.email.trim().toLowerCase();

    // Look for existing user by google_id OR email
    const userResult = await query(
      `SELECT id, name AS full_name, name, email, phone, role, is_active, created_at, avatar_url, google_id, auth_provider
       FROM users 
       WHERE (google_id IS NOT NULL AND google_id = $1) OR LOWER(email) = $2`,
      [googleUser.googleId, cleanEmail]
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

      // Update google_id and avatar if missing
      const updatedResult = await query(
        `UPDATE users 
         SET google_id = COALESCE(google_id, $1),
             avatar_url = COALESCE($2, avatar_url),
             auth_provider = COALESCE(auth_provider, 'google'),
             updated_at = NOW() 
         WHERE id = $3
         RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at, avatar_url, google_id, auth_provider`,
        [googleUser.googleId, googleUser.picture, user.id]
      );
      user = updatedResult.rows[0];
    } else {
      // Auto-register new customer account via Google
      const newUserResult = await query(
        `INSERT INTO users (name, email, google_id, avatar_url, auth_provider, role, is_active)
         VALUES ($1, $2, $3, $4, 'google', 'customer', true)
         RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at, avatar_url, google_id, auth_provider`,
        [googleUser.name.trim(), cleanEmail, googleUser.googleId, googleUser.picture]
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

    const googleUser = await verifyGoogleTokenOrCode({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'https://drishti-atelier-business.onrender.com',
    });

    if (!googleUser || !googleUser.email) {
      return res.redirect(`${clientUrl}/auth/callback?error=google_auth_failed`);
    }

    const cleanEmail = googleUser.email.trim().toLowerCase();
    const userResult = await query(
      `SELECT id, name AS full_name, name, email, phone, role, is_active, created_at, avatar_url, google_id, auth_provider
       FROM users 
       WHERE (google_id IS NOT NULL AND google_id = $1) OR LOWER(email) = $2`,
      [googleUser.googleId, cleanEmail]
    );

    let user;
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      if (!user.is_active) {
        return res.redirect(`${clientUrl}/auth/callback?error=account_deactivated`);
      }
      const updatedResult = await query(
        `UPDATE users 
         SET google_id = COALESCE(google_id, $1),
             avatar_url = COALESCE($2, avatar_url),
             auth_provider = COALESCE(auth_provider, 'google'),
             updated_at = NOW() 
         WHERE id = $3
         RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at, avatar_url, google_id, auth_provider`,
        [googleUser.googleId, googleUser.picture, user.id]
      );
      user = updatedResult.rows[0];
    } else {
      const newUserResult = await query(
        `INSERT INTO users (name, email, google_id, avatar_url, auth_provider, role, is_active)
         VALUES ($1, $2, $3, $4, 'google', 'customer', true)
         RETURNING id, name AS full_name, name, email, phone, role, is_active, created_at, avatar_url, google_id, auth_provider`,
        [googleUser.name.trim(), cleanEmail, googleUser.googleId, googleUser.picture]
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
