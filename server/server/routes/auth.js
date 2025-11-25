const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.post('/register',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  authController.register
);

router.post('/login', authController.login);

router.get('/me', requireAuth, authController.me);

// Admin routes
router.get('/admin/users', requireAuth, requireRole('admin'), authController.getAllUsers);

module.exports = router;
