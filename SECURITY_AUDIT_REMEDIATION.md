# Drishti Atelier — Security Audit & Remediation Plan

**Generated:** 2026-10-12  
**Branch:** `fix-guide`  
**Auditor:** Automated Security Review  
**Scope:** Full-stack (Backend API + Frontend React App)

---

## 📊 Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 5 |
| 🟠 High | 15 |
| 🟡 Medium | 15 |
| 🟢 Low/Info | 10 |
| **Total** | **45** |

**Risk Score:** 8.2/10 (High)  
**Primary Concerns:** Authentication flaws, missing CSRF, weak CORS, token handling, no rate limiting on sensitive endpoints.

---

## 🔴 Critical Vulnerabilities (Fix Immediately)

### C-01: Hardcoded JWT Secret Fallback
**Location:** `server/middleware/auth.js:19`, `server/controllers/authController.js:9`  
**CWE:** [CWE-798](https://cwe.mitre.org/data/definitions/798.html) — Use of Hardcoded Credentials  
**Impact:** If `JWT_SECRET` env var missing, all tokens signed with predictable secret → token forgery, account takeover.

```javascript
// VULNERABLE
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vision-eye-care-dev-secret-key-2026');
```

**Remediation:**
```javascript
// server/middleware/auth.js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters');
}
const decoded = jwt.verify(token, JWT_SECRET);
```

**Validation:** Start server without `JWT_SECRET` → should crash with clear error.

---

### C-02: JWT in URL Query Parameter (OAuth Redirect)
**Location:** `server/controllers/authController.js:610`  
**CWE:** [CWE-598](https://cwe.mitre.org/data/definitions/598.html) — Information Exposure in Query Strings  
**Impact:** Token leaked in browser history, server logs, Referer headers, proxy logs.

```javascript
// VULNERABLE
return res.redirect(`${clientUrl}/auth/callback?token=${encodeURIComponent(token)}`);
```

**Remediation:**
1. Set `HttpOnly; Secure; SameSite=Strict` cookie on backend
2. Frontend reads user from `/api/auth/me` after redirect
3. Remove token from URL entirely

```javascript
// server/controllers/authController.js
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // or 'strict' if no cross-site needs
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
});
return res.redirect(`${clientUrl}/auth/callback`);
```

**Frontend:** Remove `loginWithToken`, call `fetchCurrentUser()` on callback page load.

---

### C-03: No CSRF Protection on State-Changing Endpoints
**Location:** All POST/PUT/DELETE routes  
**CWE:** [CWE-352](https://cwe.mitre.org/data/definitions/352.html) — Cross-Site Request Forgery  
**Impact:** Attackers can forge requests (change password, place orders, delete data) via victim's browser.

**Remediation:**
```bash
npm install csurf
```

```javascript
// server/app.js
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true, sameSite: 'strict' } });

// Apply to all non-GET routes
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

// Expose CSRF token for frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

**Frontend:** Include `X-CSRF-Token` header on all mutations.

---

### C-04: Insecure CORS — Subdomain Takeover Risk
**Location:** `server/app.js:33-36`  
**CWE:** [CWE-942](https://cwe.mitre.org/data/definitions/942.html) — Permissive Cross-Domain Policy  
**Impact:** Any `*.onrender.com` or `*.vercel.app` subdomain can call API → abandoned subdomain takeover.

```javascript
// VULNERABLE
if (origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
  return callback(null, true);
}
```

**Remediation:**
```javascript
// server/app.js
const allowedOrigins = [
  'https://drishti-atelier.vercel.app',
  'https://drishti-atelier-business.onrender.com',
  // Add exact production domains only
];

if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push(
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  );
}

// In callback:
if (allowedOrigins.includes(origin)) {
  return callback(null, true);
}
```

**Validation:** Test with `curl -H "Origin: https://evil.onrender.com" https://api.drishti.com` → should reject.

---

### C-05: No Rate Limiting on Auth Endpoints
**Location:** `server/app.js:87-93`  
**CWE:** [CWE-307](https://cwe.mitre.org/data/definitions/307.html) — Improper Restriction of Excessive Authentication Attempts  
**Impact:** Credential stuffing, brute-force, account enumeration.

```javascript
// CURRENT: 30 req/15min (too permissive)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 500 : 30,
});
```

**Remediation:**
```javascript
// server/app.js
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 min
  message: { status: 'fail', message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip + ':' + (req.body.email || req.body.identifier || 'unknown'),
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Stricter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: { status: 'fail', message: 'Too many registrations. Try again later.' },
});

// Apply specifically
app.post('/api/auth/login', authLimiter, authController.login);
app.post('/api/auth/register', registerLimiter, authController.register);
app.post('/api/auth/google', authLimiter, authController.googleAuth);
```

---

## 🟠 High Vulnerabilities (Fix Within 1 Week)

### H-01: Weak Password Policy (6 chars, no complexity)
**Location:** `server/controllers/authController.js:37-38`  
**Fix:** Enforce 12+ chars, uppercase, lowercase, number, symbol. Use `zxcvbn` for entropy scoring.

```javascript
const zxcvbn = require('zxcvbn');

if (!password || password.length < 12) {
  return res.status(400).json({ message: 'Password must be at least 12 characters.' });
}
const score = zxcvbn(password).score; // 0-4
if (score < 3) {
  return res.status(400).json({ message: 'Password too weak. Use a mix of upper/lower/numbers/symbols.' });
}
```

---

### H-06: File Upload Path Traversal
**Location:** `server/middleware/upload.js:10-12`  
**Fix:** Sanitize filename, use secure random names only.

```javascript
const crypto = require('crypto');
const path = require('path');

filename: function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  if (!allowedExts.includes(ext)) {
    return cb(new Error('Invalid extension'), false);
  }
  const safeName = crypto.randomBytes(16).toString('hex') + ext;
  cb(null, safeName);
}
```

---

### H-07: No File Content Validation (Magic Bytes)
**Location:** `server/middleware/upload.js:17-23`  
**Fix:** Verify file signatures after upload.

```javascript
const fileType = require('file-type');

const validateFile = async (filePath) => {
  const buffer = await fs.promises.readFile(filePath);
  const type = await fileType.fromBuffer(buffer);
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  return type && allowed.includes(type.mime);
};
```

---

### H-08: No Account Lockout / Brute Force Protection
**Location:** `server/controllers/authController.js:105-183`  
**Fix:** Track failed attempts in Redis or DB, lock after 5 failures for 30 min.

```javascript
// Add to users table: failed_login_attempts, locked_until
// In login():
if (user.failed_login_attempts >= 5 && user.locked_until > new Date()) {
  return res.status(429).json({ message: 'Account locked. Try again in 30 minutes.' });
}
if (!isPasswordValid) {
  await query('UPDATE users SET failed_login_attempts = failed_login_attempts + 1, locked_until = CASE WHEN failed_login_attempts >= 4 THEN NOW() + INTERVAL \'30 minutes\' ELSE locked_until END WHERE id = $1', [user.id]);
  return res.status(401).json({ message: 'Invalid credentials.' });
}
// On success:
await query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1', [user.id]);
```

---

### H-09: Missing JWT Audience/Issuer Validation
**Location:** `server/middleware/auth.js:19`, `server/controllers/authController.js:11-15`  
**Fix:** Add `iss` and `aud` claims, validate on verify.

```javascript
// Generate
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: '15m', issuer: 'drishti-atelier', audience: 'drishti-client' }
);

// Verify
const decoded = jwt.verify(token, JWT_SECRET, {
  issuer: 'drishti-atelier',
  audience: 'drishti-client'
});
```

---

### H-10: No Refresh Token / Token Rotation
**Impact:** Compromised access token valid for 7 days.  
**Fix:** Implement short-lived access tokens (15min) + refresh tokens (7d, rotating, revocable).

```sql
-- Add to DB
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replaced_by_token_hash VARCHAR(255)
);
CREATE INDEX ON refresh_tokens (user_id);
```

```javascript
// Issue both tokens
function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m', issuer: 'drishti-atelier', audience: 'drishti-client' });
  const refreshToken = crypto.randomBytes(32).toString('hex');
  const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  await query('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')', [user.id, refreshHash]);
  return { accessToken, refreshToken };
}
```

---

### H-11: Google OAuth Missing State Parameter
**Location:** `server/controllers/authController.js:527-546`  
**Fix:** Generate and validate `state` parameter.

```javascript
function getGoogleAuthUrl(req, res) {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state; // Requires express-session
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'profile', 'email'],
    state,
    prompt: 'select_account',
  });
  res.json({ url });
}

async function handleGoogleRedirect(req, res) {
  if (req.query.state !== req.session.oauthState) {
    return res.redirect(`${clientUrl}/auth/callback?error=invalid_state`);
  }
  // ... rest of flow
}
```

---

### H-12: Debug Demo Credentials in Production Frontend
**Location:** `client/src/pages/Auth/Login.jsx:226-242`  
**Fix:** Remove or gate behind `NODE_ENV === 'development'`.

```javascript
{process.env.NODE_ENV === 'development' && (
  <div className="auth-demo-section">...</div>
)}
```

---

### H-13: No Email Verification on Registration
**Location:** `server/controllers/authController.js:22-98`  
**Fix:** Send verification email, set `is_active: false` until verified.

```javascript
// Add to users table: email_verified BOOLEAN DEFAULT FALSE, verification_token, verification_expires
const verificationToken = crypto.randomBytes(32).toString('hex');
await query('INSERT INTO users (..., verification_token, verification_expires) VALUES (..., $1, NOW() + INTERVAL \'24 hours\')', [verificationToken]);
await sendEmail(user.email, 'Verify your email', `Click: ${CLIENT_URL}/verify-email?token=${verificationToken}`);
```

---

### H-14: Secrets Committed in `.env` Files
**Location:** `D:\Drishti\.env`, `D:\Drishti\server\.env`  
**Fix:** 
1. Add to `.gitignore` (already there? verify)
2. Rotate ALL secrets immediately (JWT_SECRET, DB_URL, Google OAuth, Cloudinary)
3. Use GitHub secret scanning / `git-secrets` pre-commit hook

---

### H-15: Database SSL Verification Disabled
**Location:** `server/db/pool.js:8`  
**Fix:** Enable cert verification for production.

```javascript
ssl: process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: true, ca: process.env.PG_CA_CERT }
  : { rejectUnauthorized: false },
```

---

## 🟡 Medium Vulnerabilities (Fix Within Sprint)

| ID | Issue | Location | Fix Summary |
|----|-------|----------|-------------|
| M-01 | No rate limit on `/api/contact`, `/api/newsletter` | `server/routes/public.js` | Add `rateLimit({ max: 10, windowMs: 60min })` |
| M-02 | Predictable order numbers | `server/controllers/orderController.js:227` | Use `crypto.randomUUID()` or ULID |
| M-03 | Token in localStorage (XSS accessible) | `client/src/services/api.js:21` | Move to HttpOnly cookie |
| M-04 | No API versioning | `server/app.js:97-105` | Prefix routes with `/api/v1/` |
| M-05 | Large JSON body limit (10MB) | `server/app.js:46` | Reduce to `1mb` |
| M-06 | No request validation library | All controllers | Add `zod` or `joi` schemas |
| M-07 | Inconsistent coupon case handling | `server/controllers/orderController.js:17` | Store normalized (UPPER), compare normalized |
| M-08 | Admin actions not audited | `server/controllers/adminController.js` | Add audit log table + middleware |
| M-09 | Order status transitions unvalidated | `server/controllers/adminController.js:188-201` | Define valid transitions (pending→confirmed→processing→shipped→delivered) |
| M-10 | Frontend 401 handler incomplete | `client/src/services/api.js:34-44` | Redirect to `/login` with `from` state |
| M-11 | Cloudinary fallback to local uploads insecure | `server/config/cloudinary.js:24-26` | Require Cloudinary in prod, validate upload path |
| M-12 | No password hash upgrade strategy | `server/controllers/authController.js:76` | Re-hash on login if rounds < current standard |
| M-13 | Sensitive data in error logs | `server/db/pool.js:32`, `authController.js:515` | Sanitize logs (remove passwords, tokens) |
| M-14 | No automated dependency scanning | `package.json` | Add `npm audit` CI step, Dependabot alerts |
| M-15 | Pagination limits not enforced everywhere | Multiple controllers | Cap all `limit` params at 100 |

---

## 🟢 Low / Informational (Technical Debt)

| ID | Issue | Location | Fix Summary |
|----|-------|----------|-------------|
| L-01 | Missing CSP/HSTS/Permissions-Policy headers | `server/app.js:13-15` | Configure Helmet fully |
| L-02 | No Referrer-Policy header | `server/app.js:13-15` | Add `helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' })` |
| L-03 | Console logs in production | Multiple | Use `pino` or `winston` with log levels |
| L-04 | No Subresource Integrity (SRI) | `client/index.html` | Add `integrity` attrs to CDN scripts |
| L-05 | Inline scripts/styles break CSP | Frontend | Use nonces or move to external files |
| L-06 | No X-Frame-Options explicit | `server/app.js:13-15` | `helmet.frameguard({ action: 'deny' })` |
| L-07 | Frontend uses `localStorage` for auth | `client/src/context/AuthContext.jsx:9` | Migrate to HttpOnly cookies |
| L-08 | No content security policy nonce | Frontend | Generate per-request nonce for inline scripts |
| L-09 | Debug query logging | `server/db/pool.js:32` | Disable in production |
| L-10 | No dependency license audit | `package.json` | Add `license-checker` to CI |

---

## 📋 Remediation Roadmap

### Phase 1: Critical (Week 1) — **DO NOT DEPLOY WITHOUT THESE**

| Task | Files | Effort | Owner |
|------|-------|--------|-------|
| Remove JWT secret fallback, enforce 32+ char secret | `auth.js`, `authController.js` | 30 min | Backend |
| Move JWT to HttpOnly cookie, remove from URL | `authController.js`, `api.js`, `AuthContext.jsx` | 2 hr | Full-stack |
| Implement CSRF protection (double-submit cookie) | `app.js`, all routes, frontend API | 3 hr | Full-stack |
| Restrict CORS to exact production domains | `app.js` | 30 min | Backend |
| Implement strict auth rate limiting (5/15min) | `app.js`, `auth.js` routes | 1 hr | Backend |
| Rotate all committed secrets | `.env`, GitHub secrets, Google Cloud, Cloudinary | 1 hr | DevOps |

### Phase 2: High (Week 2)

| Task | Files | Effort | Owner |
|------|-------|--------|-------|
| Strengthen password policy (zxcvbn) | `authController.js` | 1 hr | Backend |
| Add account lockout after failed attempts | `authController.js`, DB migration | 2 hr | Backend |
| Implement refresh token rotation | `authController.js`, `auth.js`, DB | 4 hr | Backend |
| Add Google OAuth state parameter | `authController.js`, session middleware | 1 hr | Backend |
| Secure file uploads (sanitize, magic bytes) | `upload.js`, `productController.js` | 2 hr | Backend |
| Remove demo credentials from production build | `Login.jsx` | 15 min | Frontend |
| Add email verification flow | `authController.js`, email service, DB | 3 hr | Backend |
| Enable DB SSL cert verification | `pool.js` | 15 min | Backend |

### Phase 3: Medium (Week 3-4)

| Task | Files | Effort | Owner |
|------|-------|--------|-------|
| Add rate limiting to public endpoints | `public.js` routes | 30 min | Backend |
| Implement API versioning (`/api/v1/`) | `app.js`, all routes | 2 hr | Backend |
| Add request validation (zod) | All controllers | 4 hr | Backend |
| Add audit logging for admin actions | `adminController.js`, new table | 2 hr | Backend |
| Validate order status transitions | `adminController.js` | 1 hr | Backend |
| Fix frontend 401 redirect | `api.js`, `AuthContext.jsx` | 30 min | Frontend |
| Reduce JSON body limit | `app.js` | 5 min | Backend |
| Sanitize error logs | `pool.js`, `authController.js` | 30 min | Backend |
| Add CI dependency scanning | GitHub Actions | 1 hr | DevOps |

### Phase 4: Low / Hardening (Ongoing)

| Task | Files | Effort | Owner |
|------|-------|--------|-------|
| Full Helmet configuration (CSP, HSTS, etc.) | `app.js` | 2 hr | Backend |
| Add Referrer-Policy, Permissions-Policy | `app.js` | 30 min | Backend |
| Structured logging (pino/winston) | `pool.js`, all controllers | 2 hr | Backend |
| Add SRI to frontend CDN resources | `index.html` | 30 min | Frontend |
| Implement CSP nonces for inline scripts | `vite.config.js`, `index.html` | 2 hr | Frontend |
| Migrate frontend auth to HttpOnly cookies | `AuthContext.jsx`, `api.js` | 2 hr | Frontend |
| Add pre-commit secret scanning | `.github/workflows`, `husky` | 1 hr | DevOps |

---

## ✅ Verification Checklist

### Pre-Deployment Security Gates
- [ ] `npm audit` passes with 0 critical/high
- [ ] `JWT_SECRET` >= 32 chars, no fallback
- [ ] All auth endpoints rate limited (<10 req/15min)
- [ ] CSRF tokens required on all mutations
- [ ] CORS allows only exact production domains
- [ ] Tokens in HttpOnly cookies, not localStorage/URL
- [ ] Refresh token rotation implemented
- [ ] Email verification required for new accounts
- [ ] Password policy: 12+ chars, zxcvbn score >= 3
- [ ] Account lockout after 5 failed attempts
- [ ] File uploads validated (magic bytes, sanitized names)
- [ ] Google OAuth uses `state` parameter
- [ ] No demo credentials in production build
- [ ] DB SSL `rejectUnauthorized: true` in production
- [ ] All secrets rotated, none in repo history
- [ ] Admin actions audit logged
- [ ] Order status transitions validated
- [ ] API versioned (`/api/v1/`)
- [ ] Request validation schemas on all endpoints
- [ ] Structured logging (no sensitive data)
- [ ] CSP, HSTS, Referrer-Policy headers configured
- [ ] SRI on all external resources
- [ ] Dependency scanning in CI/CD

---

## 🔧 Quick Wins (Can Do Today)

```bash
# 1. Rotate JWT secret immediately
openssl rand -base64 48
# Add to production env, restart server

# 2. Remove demo credentials from frontend
# Edit client/src/pages/Auth/Login.jsx - wrap demo section in dev check

# 3. Reduce JSON body limit
# server/app.js: express.json({ limit: '1mb' })

# 4. Add rate limit to contact/newsletter
# server/routes/public.js - wrap with rateLimit({ max: 10, windowMs: 60*60*1000 })

# 5. Enable DB SSL verification for production
# server/db/pool.js: rejectUnauthorized: process.env.NODE_ENV === 'production'

# 6. Add .env to .gitignore if missing, rotate all secrets
```

---

## 📚 References

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [NIST SP 800-63B Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

---

## 📝 Appendices

### A. Database Migrations Required

```sql
-- For account lockout
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN verification_expires TIMESTAMPTZ;

-- For refresh tokens
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replaced_by_token_hash VARCHAR(255)
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- For audit log
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### B. Required npm Packages

```bash
# Security
npm install csurf zxcvbn file-type helmet@latest
npm install -D @types/csurf

# Logging
npm install pino pino-pretty

# Validation
npm install zod

# Email (choose one)
npm install nodemailer @sendgrid/mail
```

### C. Environment Variables Checklist

```env
# REQUIRED - Generate new values
JWT_SECRET=<64-char-base64>
DATABASE_URL=<neon-connection-string-with-ssl>
GOOGLE_CLIENT_ID=<from-google-cloud>
GOOGLE_CLIENT_SECRET=<from-google-cloud>
GOOGLE_REDIRECT_URI=https://api.drishti.com/api/auth/google/callback

# REQUIRED - Production domains only
CLIENT_URL=https://drishti-atelier.vercel.app
CORS_ORIGINS=https://drishti-atelier.vercel.app,https://admin.drishti.com

# REQUIRED - Email service
SENDGRID_API_KEY=<or SMTP credentials>
FROM_EMAIL=noreply@drishti-atelier.com

# REQUIRED - Cloudinary
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

# OPTIONAL - Security
SESSION_SECRET=<32-char-random>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_AUTH=5
RATE_LIMIT_MAX_REGISTER=3
```

---

*End of Security Audit Report*  
*Next Review: After Phase 1 completion*