const express = require('express');
const bcrypt = require('bcrypt');
const { db } = require('../db');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { generateToken } = require('../middleware/auth');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [userId] = await db('users').insert({
      email,
      password: hashedPassword,
      role: 'user', // Default role
    }).returning('id');
    
    const user = {
      id: userId,
      email,
      role: 'user',
    };
    
    // Generate token using the shared function
    const token = generateToken(user);
    
    // Return token and user info
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find user
    const user = await db('users').where({ email }).first();
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token using the shared function
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role || 'user',
    });
    
    // Return token and user info
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  // In a real app, you might want to invalidate the token
  // But for this demo, we'll just return success
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router; 