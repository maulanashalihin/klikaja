"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('link_tags', function (table) {
        table.uuid('link_id').notNullable();
        table.uuid('tag_id').notNullable();
        table.bigInteger('created_at').notNullable();
        table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE');
        table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');
        table.primary(['link_id', 'tag_id']);
        table.index('link_id');
        table.index('tag_id');
    });
}
async function down(knex) {
    await knex.schema.dropTable('link_tags');
}
//# sourceMappingURL=20251111000003_create_link_tags_table.js.map