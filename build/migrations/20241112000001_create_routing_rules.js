"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('routing_rules', (table) => {
        table.increments('id').primary();
        table.integer('link_id').unsigned().notNullable();
        table.enum('rule_type', ['time', 'location', 'device', 'language', 'ab_test']).notNullable();
        table.json('condition').notNullable();
        table.string('target_url').notNullable();
        table.integer('weight').defaultTo(1);
        table.integer('priority').defaultTo(0);
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
        table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
        table.index(['link_id', 'is_active']);
        table.index(['rule_type']);
    });
    await knex.schema.createTable('routing_logs', (table) => {
        table.increments('id').primary();
        table.integer('link_id').unsigned().notNullable();
        table.integer('rule_id').unsigned().nullable();
        table.string('ip_address', 45);
        table.text('user_agent');
        table.string('country', 2).nullable();
        table.string('device').nullable();
        table.bigInteger('routed_at');
        table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
        table.foreign('rule_id').references('id').inTable('routing_rules').onDelete('SET NULL');
        table.index(['link_id', 'routed_at']);
        table.index(['rule_id']);
        table.index(['routed_at']);
    });
    await knex.schema.createTable('ab_test_conversions', (table) => {
        table.increments('id').primary();
        table.integer('link_id').unsigned().notNullable();
        table.string('test_name').notNullable();
        table.string('variant_name').notNullable();
        table.bigInteger('converted_at');
        table.string('conversion_type').defaultTo('click');
        table.decimal('conversion_value', 10, 2).nullable();
        table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
        table.index(['link_id', 'test_name']);
        table.index(['converted_at']);
    });
    await knex.schema.createTable('link_performance_scores', (table) => {
        table.increments('id').primary();
        table.integer('link_id').unsigned().notNullable().unique();
        table.integer('score').notNullable();
        table.json('metrics');
        table.text('recommendations');
        table.bigInteger('calculated_at');
        table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
        table.index(['link_id']);
        table.index(['score']);
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('link_performance_scores');
    await knex.schema.dropTableIfExists('ab_test_conversions');
    await knex.schema.dropTableIfExists('routing_logs');
    await knex.schema.dropTableIfExists('routing_rules');
}
//# sourceMappingURL=20241112000001_create_routing_rules.js.map