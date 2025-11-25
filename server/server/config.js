require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'quizify-secret-key-2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d"
};
