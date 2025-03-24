const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');
const { db } = require('../db');
const logger = require('../utils/logger');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const [userId] = await db('users').insert({
      email,
      password: hashedPassword,
      name,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');
    
    // Generate token
    const user = { id: userId, email, role: 'user' };
    const token = generateToken(user);
    
    // Return token and user info
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        name,
        role: 'user',
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = await db('users').where({ email }).first();
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return token and user info
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  // In a real app, you might want to invalidate the token
  // But for this demo, we'll just return success
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router; 