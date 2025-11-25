const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findByEmail(email);
    if (!userData) return res.status(400).json({ message: "Invalid credentials" });

    // Use static method to compare password
    const ok = await User.comparePassword(password, userData.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: userData.id }, jwtSecret, { expiresIn: jwtExpiresIn });

    res.json({
      token,
      user: { id: userData.id, name: userData.name, email: userData.email, role: userData.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

// Admin endpoint to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    // Remove password from response
    const safeUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    res.json(safeUsers);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
