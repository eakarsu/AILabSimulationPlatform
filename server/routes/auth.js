const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();
router.use((req, res, next) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 ||
      !/^[A-Za-z0-9][A-Za-z0-9._:-]+$/.test(process.env.GOVERNANCE_TENANT_ID || '')) {
    return res.status(503).json({ error: 'Authentication is not configured' });
  }
  next();
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, tenantId: process.env.GOVERNANCE_TENANT_ID },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Current authenticated identity
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role'],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: process.env.GOVERNANCE_TENANT_ID,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || password.length < 12) return res.status(400).json({ error: 'Valid email and 12-character password required' });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, firstName, lastName, role: 'student' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, tenantId: process.env.GOVERNANCE_TENANT_ID },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(201).json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
