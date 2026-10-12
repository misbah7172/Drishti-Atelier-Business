/**
 * Middleware to restrict access to admin users only
 * Requires authenticateToken middleware to run first
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied. Administrator privileges required.',
    });
  }

  next();
}

module.exports = {
  requireAdmin,
};
