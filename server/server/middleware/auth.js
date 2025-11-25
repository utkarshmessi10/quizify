const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config');

exports.requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res.status(401).json({ message: "Missing token" });

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, jwtSecret);

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    // Remove password before sending
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
