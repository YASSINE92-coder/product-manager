const { error } = require("console");

// auth.js
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.headers['authorization'];

  // Simple token check (you can change the value)
  const validToken = 'ACC1001';

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (token !== validToken) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  // Token is valid, continue to next middleware or route
  next();
};
