"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('folders', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('user_id').notNullable();
        table.string('name', 255).notNullable();
        table.string('color', 7).defaultTo('#FF6B35');
        table.string('icon', 50).nullable();
        table.text('description').nullable();
        table.integer('position').defaultTo(0);
        table.bigInteger('created_at').notNullable();
        table.bigInteger('updated_at').notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.index('user_id');
        table.index(['user_id', 'position']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('folders');
}
//# sourceMappingURL=20251111000001_create_folders_table.js.map