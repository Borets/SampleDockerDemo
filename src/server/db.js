const knex = require('knex');
const config = require('../../knexfile');
const logger = require('./utils/logger');

// Determine which environment configuration to use
const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// Setup function to verify database connection and run migrations
const setupDb = async () => {
  try {
    // Add an artificial delay to simulate complexity in setup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify database connection
    await db.raw('SELECT 1');
    logger.info(`Connected to ${environment} database`);
    
    // Run migrations if needed
    await db.migrate.latest();
    logger.info('Migrations completed');
    
    // Seed data in development
    if (environment === 'development') {
      await db.seed.run();
      logger.info('Seed data created');
    }
    
    return db;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

// Export the database instance and setup function
module.exports = {
  db,
  setupDb
}; 