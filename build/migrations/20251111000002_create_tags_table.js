"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('tags', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('user_id').notNullable();
        table.string('name', 100).notNullable();
        table.string('slug', 100).notNullable();
        table.string('color', 7).defaultTo('#00D9FF');
        table.text('description').nullable();
        table.integer('links_count').defaultTo(0);
        table.bigInteger('created_at').notNullable();
        table.bigInteger('updated_at').notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.index('user_id');
        table.index('slug');
        table.unique(['user_id', 'slug']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('tags');
}
//# sourceMappingURL=20251111000002_create_tags_table.js.map