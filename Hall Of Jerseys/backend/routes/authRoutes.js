// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Health check endpoint for auth
router.get('/ping', (req, res) => {
  res.json({ ok: true, service: 'auth', env: process.env.NODE_ENV || 'development' });
});

// Placeholder - you'll replace with real controllers
router.post('/register', (req, res) => {
  res.status(501).json({ error: 'Not implemented - replace with authController.register' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ error: 'Not implemented - replace with authController.login' });
});

module.exports = router;
