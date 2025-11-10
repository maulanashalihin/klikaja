"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('links', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('user_id').nullable();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.string('alias', 100).unique().notNullable();
        table.text('urls').notNullable();
        table.enum('rotation_method', ['random', 'sequential', 'weighted']).defaultTo('random');
        table.integer('current_index').defaultTo(0);
        table.string('title', 255).nullable();
        table.text('description').nullable();
        table.string('password', 180).nullable();
        table.bigInteger('expires_at').nullable();
        table.integer('max_clicks').nullable();
        table.integer('click_count').defaultTo(0);
        table.boolean('is_active').defaultTo(true);
        table.boolean('is_claimed').defaultTo(false);
        table.string('claim_token', 100).unique().nullable();
        table.string('qr_code_path', 255).nullable();
        table.bigInteger('created_at').notNullable();
        table.bigInteger('updated_at').notNullable();
        table.index('alias');
        table.index('user_id');
        table.index('claim_token');
        table.index('is_active');
        table.index('created_at');
    });
}
async function down(knex) {
    await knex.schema.dropTable('links');
}
//# sourceMappingURL=20251110000001_create_links_table.js.map