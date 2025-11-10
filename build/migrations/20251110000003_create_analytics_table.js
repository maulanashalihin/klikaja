"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('analytics', function (table) {
        table.uuid('id').primary().notNullable();
        table.uuid('link_id').notNullable();
        table.foreign('link_id').references('links.id').onDelete('CASCADE');
        table.bigInteger('clicked_at').notNullable();
        table.string('ip_address', 45).nullable();
        table.text('user_agent').nullable();
        table.enum('device_type', ['mobile', 'desktop', 'tablet', 'bot', 'unknown']).defaultTo('unknown');
        table.string('browser', 100).nullable();
        table.string('os', 100).nullable();
        table.string('country', 100).nullable();
        table.string('city', 100).nullable();
        table.string('region', 100).nullable();
        table.text('referrer').nullable();
        table.string('referrer_domain', 255).nullable();
        table.string('utm_source', 255).nullable();
        table.string('utm_medium', 255).nullable();
        table.string('utm_campaign', 255).nullable();
        table.string('utm_term', 255).nullable();
        table.string('utm_content', 255).nullable();
        table.index('link_id');
        table.index('clicked_at');
        table.index('device_type');
        table.index('country');
        table.index('referrer_domain');
        table.index(['link_id', 'clicked_at']);
    });
}
async function down(knex) {
    await knex.schema.dropTable('analytics');
}
//# sourceMappingURL=20251110000003_create_analytics_table.js.map