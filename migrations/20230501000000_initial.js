/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('role').notNullable().defaultTo('user');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Index for faster lookups
      table.index('email');
    })
    .createTable('tasks', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('title').notNullable();
      table.text('description');
      table.string('status').notNullable().defaultTo('pending');
      table.string('priority').notNullable().defaultTo('medium');
      table.date('due_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Foreign key constraint
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      
      // Indexes for faster lookups
      table.index('user_id');
      table.index('status');
      table.index('due_date');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('tasks')
    .dropTableIfExists('users');
}; 