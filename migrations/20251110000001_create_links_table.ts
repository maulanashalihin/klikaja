import { Knex } from "knex";

/**
 * KlikAja - Links Table Migration
 * Core table for storing shortened links
 * Supports anonymous links (user_id nullable) and link claiming
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('links', function (table) {
        table.uuid('id').primary().notNullable()
        
        // User relationship - NULLABLE for anonymous links
        table.uuid('user_id').nullable()
        table.foreign('user_id').references('users.id').onDelete('CASCADE')
        
        // Link details
        table.string('alias', 100).unique().notNullable()
        // JSON array format:
        // Simple: ["url1", "url2", "url3"]
        // Weighted: [{"url": "url1", "weight": 50}, {"url": "url2", "weight": 30}]
        table.text('urls').notNullable()
        table.enum('rotation_method', ['random', 'sequential', 'weighted']).defaultTo('random')
        table.integer('current_index').defaultTo(0) // For sequential rotation
        
        // Metadata
        table.string('title', 255).nullable()
        table.text('description').nullable()
        
        // Security & limits
        table.string('password', 180).nullable() // Hashed password
        table.bigInteger('expires_at').nullable()
        table.integer('max_clicks').nullable()
        table.integer('click_count').defaultTo(0)
        
        // Status flags
        table.boolean('is_active').defaultTo(true)
        table.boolean('is_claimed').defaultTo(false) // For anonymous links
        
        // Claiming system
        table.string('claim_token', 100).unique().nullable()
        
        // QR code
        table.string('qr_code_path', 255).nullable()
        
        // Timestamps
        table.bigInteger('created_at').notNullable()
        table.bigInteger('updated_at').notNullable()
        
        // Indexes for performance
        table.index('alias') // Most important - for redirects
        table.index('user_id')
        table.index('claim_token')
        table.index('is_active')
        table.index('created_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('links')
}
