"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.alterTable('users', (table) => {
        table.text('settings').nullable().comment('User settings JSON');
    });
}
async function down(knex) {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('settings');
    });
}
//# sourceMappingURL=20250110_add_user_settings.js.map