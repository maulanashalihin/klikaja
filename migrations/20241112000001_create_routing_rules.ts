import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Routing rules table for dynamic routing
  await knex.schema.createTable('routing_rules', (table) => {
    table.increments('id').primary();
    table.integer('link_id').unsigned().notNullable();
    table.enum('rule_type', ['time', 'location', 'device', 'language', 'ab_test']).notNullable();
    table.json('condition').notNullable(); // JSON object with rule conditions
    table.string('target_url').notNullable();
    table.integer('weight').defaultTo(1); // For A/B testing weight
    table.integer('priority').defaultTo(0); // Higher priority rules checked first
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Foreign key
    table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
    
    // Indexes
    table.index(['link_id', 'is_active']);
    table.index(['rule_type']);
  });

  // Routing logs for analytics
  await knex.schema.createTable('routing_logs', (table) => {
    table.increments('id').primary();
    table.integer('link_id').unsigned().notNullable();
    table.integer('rule_id').unsigned().nullable(); // NULL for default routing
    table.string('ip_address', 45); // IPv6 support
    table.text('user_agent');
    table.string('country', 2).nullable(); // ISO country code
    table.string('device').nullable(); // mobile, desktop, tablet
    table.bigInteger('routed_at');
    
    // Foreign keys
    table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
    table.foreign('rule_id').references('id').inTable('routing_rules').onDelete('SET NULL');
    
    // Indexes
    table.index(['link_id', 'routed_at']);
    table.index(['rule_id']);
    table.index(['routed_at']);
  });

  // A/B test conversions tracking
  await knex.schema.createTable('ab_test_conversions', (table) => {
    table.increments('id').primary();
    table.integer('link_id').unsigned().notNullable();
    table.string('test_name').notNullable();
    table.string('variant_name').notNullable();
    table.bigInteger('converted_at');
    table.string('conversion_type').defaultTo('click'); // click, signup, purchase, etc.
    table.decimal('conversion_value', 10, 2).nullable(); // For revenue tracking
    
    // Foreign key
    table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
    
    // Indexes
    table.index(['link_id', 'test_name']);
    table.index(['converted_at']);
  });

  // Link performance scores
  await knex.schema.createTable('link_performance_scores', (table) => {
    table.increments('id').primary();
    table.integer('link_id').unsigned().notNullable().unique();
    table.integer('score').notNullable(); // 0-100
    table.json('metrics'); // Detailed metrics breakdown
    table.text('recommendations'); // JSON array of recommendations
    table.bigInteger('calculated_at');
    
    // Foreign key
    table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
    
    // Indexes
    table.index(['link_id']);
    table.index(['score']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('link_performance_scores');
  await knex.schema.dropTableIfExists('ab_test_conversions');
  await knex.schema.dropTableIfExists('routing_logs');
  await knex.schema.dropTableIfExists('routing_rules');
}