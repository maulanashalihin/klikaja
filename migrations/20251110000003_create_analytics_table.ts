import { Knex } from "knex";

/**
 * KlikAja - Analytics Table Migration
 * Tracks every click on shortened links
 * Stores device, location, and referrer information
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('analytics', function (table) {
        table.uuid('id').primary().notNullable()
        
        // Link relationship
        table.uuid('link_id').notNullable()
        table.foreign('link_id').references('links.id').onDelete('CASCADE')
        
        // Click timestamp
        table.bigInteger('clicked_at').notNullable()
        
        // User information
        table.string('ip_address', 45).nullable() // IPv6 support
        table.text('user_agent').nullable()
        
        // Device analytics
        table.enum('device_type', ['mobile', 'desktop', 'tablet', 'bot', 'unknown']).defaultTo('unknown')
        table.string('browser', 100).nullable()
        table.string('os', 100).nullable()
        
        // Geographic data
        table.string('country', 100).nullable()
        table.string('city', 100).nullable()
        table.string('region', 100).nullable() // State/Province
        
        // Referrer tracking
        table.text('referrer').nullable()
        table.string('referrer_domain', 255).nullable()
        
        // UTM parameters for campaign tracking
        table.string('utm_source', 255).nullable()
        table.string('utm_medium', 255).nullable()
        table.string('utm_campaign', 255).nullable()
        table.string('utm_term', 255).nullable()
        table.string('utm_content', 255).nullable()
        
        // Indexes for analytics queries
        table.index('link_id') // Most important - group by link
        table.index('clicked_at') // Time-based queries
        table.index('device_type')
        table.index('country')
        table.index('referrer_domain')
        table.index(['link_id', 'clicked_at']) // Composite for time-series
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('analytics')
}
