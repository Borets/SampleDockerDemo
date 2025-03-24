const express = require('express');
const { db } = require('../db');
const logger = require('../utils/logger');
const router = express.Router();

// Get current user
router.get('/me', async (req, res) => {
  try {
    const { id } = req.user;
    
    // Retrieve user from database
    const user = await db('users')
      .where({ id })
      .select('id', 'name', 'email', 'role', 'created_at')
      .first();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    logger.error('Get user error:', error);
    return res.status(500).json({ message: 'Failed to retrieve user' });
  }
});

// Update user profile
router.put('/me', async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email } = req.body;
    
    // Validate input
    if (!name && !email) {
      return res.status(400).json({ message: 'No data provided for update' });
    }
    
    // Build update object
    const updates = {};
    if (name) updates.name = name;
    if (email) {
      // Check if email is already taken
      const existingUser = await db('users').where({ email }).whereNot({ id }).first();
      
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      
      updates.email = email;
    }
    
    updates.updated_at = new Date();
    
    // Update user
    await db('users').where({ id }).update(updates);
    
    // Get updated user
    const updatedUser = await db('users')
      .where({ id })
      .select('id', 'name', 'email', 'role', 'created_at', 'updated_at')
      .first();
    
    return res.status(200).json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    logger.error('Update user error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Get all users
    const users = await db('users')
      .select('id', 'name', 'email', 'role', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
    
    return res.status(200).json({ users });
  } catch (error) {
    logger.error('Get all users error:', error);
    return res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin or deleting their own account
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    // Check if user exists
    const user = await db('users').where({ id }).first();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user
    await db('users').where({ id }).del();
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router; 