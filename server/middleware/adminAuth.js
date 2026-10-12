/**
 * Admin authorization middleware
 * Must be used AFTER auth middleware
 * Checks that the authenticated user has the 'admin' role
 */
function adminAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
}

module.exports = adminAuth;
