const express = require('express');
const router = express.Router();
const usersRoutes = require('./users');
const tasksRoutes = require('./tasks');
const authRoutes = require('./auth');
const { authMiddleware } = require('../middleware/auth');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', authMiddleware, usersRoutes);
router.use('/tasks', authMiddleware, tasksRoutes);

module.exports = router; 