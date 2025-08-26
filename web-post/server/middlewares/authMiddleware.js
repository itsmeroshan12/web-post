// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token found' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}


module.exports = verifyUser;
