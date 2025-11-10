"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('link_claims', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('link_id').notNullable();
        table.foreign('link_id').references('links.id').onDelete('CASCADE');
        table.string('claim_token', 100).unique().notNullable();
        table.bigInteger('expires_at').notNullable();
        table.bigInteger('created_at').notNullable();
        table.index('claim_token');
        table.index('link_id');
        table.index('expires_at');
    });
}
async function down(knex) {
    await knex.schema.dropTable('link_claims');
}
//# sourceMappingURL=20251110000002_create_link_claims_table.js.map