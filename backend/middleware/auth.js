// middleware/auth.js — Simple token-based auth (replace with JWT in production)
const { findUserById } = require('../data/store');

// In production use jsonwebtoken. Here we use base64(userId) as a mock token.
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  try {
    const token = header.slice(7);
    const userId = Buffer.from(token, 'base64').toString('utf8');
    const user = findUserById(userId);
    if (!user) return res.status(401).json({ error: 'Token invalide' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const makeToken = (userId) => Buffer.from(userId).toString('base64');

module.exports = { authMiddleware, makeToken };
