"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable('links', function (table) {
        table.uuid('folder_id').nullable().after('user_id');
        table.foreign('folder_id').references('id').inTable('folders').onDelete('SET NULL');
        table.index('folder_id');
        table.index(['user_id', 'folder_id']);
    });
}
async function down(knex) {
    await knex.schema.alterTable('links', function (table) {
        table.dropForeign(['folder_id']);
        table.dropIndex(['folder_id']);
        table.dropIndex(['user_id', 'folder_id']);
        table.dropColumn('folder_id');
    });
}
//# sourceMappingURL=20251111000004_add_folder_to_links.js.map