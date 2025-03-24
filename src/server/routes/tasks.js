const express = require('express');
const { db } = require('../db');
const logger = require('../utils/logger');
const router = express.Router();

// Get all tasks for current user
router.get('/', async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    // Retrieve tasks from database
    const tasks = await db('tasks')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
    
    return res.status(200).json({ tasks });
  } catch (error) {
    logger.error('Get tasks error:', error);
    return res.status(500).json({ message: 'Failed to retrieve tasks' });
  }
});

// Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;
    
    // Retrieve task from database
    const task = await db('tasks')
      .where({ 
        id: taskId,
        user_id: userId 
      })
      .first();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    return res.status(200).json({ task });
  } catch (error) {
    logger.error('Get task error:', error);
    return res.status(500).json({ message: 'Failed to retrieve task' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { title, description, due_date, priority } = req.body;
    
    // Validate input
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Insert new task
    const [taskId] = await db('tasks').insert({
      user_id: userId,
      title,
      description: description || null,
      due_date: due_date || null,
      priority: priority || 'medium',
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('id');
    
    // Get the created task
    const task = await db('tasks').where({ id: taskId }).first();
    
    return res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    logger.error('Create task error:', error);
    return res.status(500).json({ message: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;
    const { title, description, due_date, priority, status } = req.body;
    
    // Check if task exists and belongs to user
    const existingTask = await db('tasks')
      .where({ 
        id: taskId,
        user_id: userId 
      })
      .first();
    
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Build update object
    const updates = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (due_date !== undefined) updates.due_date = due_date;
    if (priority) updates.priority = priority;
    if (status) updates.status = status;
    
    updates.updated_at = new Date();
    
    // Update task
    await db('tasks').where({ id: taskId }).update(updates);
    
    // Get updated task
    const updatedTask = await db('tasks').where({ id: taskId }).first();
    
    return res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    logger.error('Update task error:', error);
    return res.status(500).json({ message: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;
    
    // Check if task exists and belongs to user
    const task = await db('tasks')
      .where({ 
        id: taskId,
        user_id: userId 
      })
      .first();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete task
    await db('tasks').where({ id: taskId }).del();
    
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Delete task error:', error);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router; 