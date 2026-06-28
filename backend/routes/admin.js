const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { adminUsers } = require('../data/store');
const { JWT_SECRET, authenticate, requireAdmin } = require('../middleware/auth');

// POST /api/admin/login
router.post('/login', [
  body('username').isString().trim().isLength({ min: 1, max: 40 }),
  body('password').isString().isLength({ min: 1, max: 100 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Invalid credentials.' });
  }

  const { username, password } = req.body;
  const user = adminUsers.find(u => u.username === username);

  // Constant-time comparison to prevent timing attacks
  const dummyHash = '$2a$12$invalidhashtopreventtimingattacks';
  const hash = user ? user.passwordHash : dummyHash;

  const valid = await bcrypt.compare(password, hash);
  if (!user || !valid) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h', issuer: 'serenity-guest-house' }
  );

  res.json({ token, username: user.username, role: user.role });
});

// GET /api/admin/me
router.get('/me', authenticate, requireAdmin, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username, role: req.user.role } });
});

module.exports = router;
