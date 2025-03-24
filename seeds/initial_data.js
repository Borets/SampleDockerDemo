const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks').del();
  await knex('users').del();
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminResult = await knex('users').insert({
    name: 'Admin User',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('id');
  
  const adminId = adminResult[0].id || adminResult[0];
  
  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const userResult = await knex('users').insert({
    name: 'Regular User',
    email: 'user@example.com',
    password: userPassword,
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
  }).returning('id');
  
  const userId = userResult[0].id || userResult[0];
  
  // Create tasks for regular user
  const taskData = [
    {
      user_id: userId,
      title: 'Complete project setup',
      description: 'Set up initial project structure and dependencies',
      status: 'completed',
      priority: 'high',
      due_date: new Date(Date.now() - 86400000), // Yesterday
      created_at: new Date(Date.now() - 172800000), // Two days ago
      updated_at: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      user_id: userId,
      title: 'Implement user authentication',
      description: 'Create login, registration, and user profile functionality',
      status: 'in_progress',
      priority: 'high',
      due_date: new Date(Date.now() + 86400000), // Tomorrow
      created_at: new Date(Date.now() - 86400000), // Yesterday
      updated_at: new Date(),
    },
    {
      user_id: userId,
      title: 'Design database schema',
      description: 'Create database migration and seed files',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 172800000), // Two days from now
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: userId,
      title: 'Add unit tests',
      description: 'Write comprehensive test suite for the application',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 259200000), // Three days from now
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: userId,
      title: 'Deploy to production',
      description: 'Configure production environment and deploy the application',
      status: 'pending',
      priority: 'low',
      due_date: new Date(Date.now() + 604800000), // Seven days from now
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  
  // Insert tasks
  await knex('tasks').insert(taskData);
}; 