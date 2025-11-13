function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).end();
    if (req.user.role !== role) return res.status(403).end();
    next();
  };
}

module.exports = requireRole;
