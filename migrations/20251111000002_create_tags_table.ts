import { Knex } from "knex";

/**
 * KlikAja - Tags Table Migration
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * Global tags that can be applied to links for better organization
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tags', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('user_id').notNullable() // Tags are user-specific
        table.string('name', 100).notNullable()
        table.string('slug', 100).notNullable() // URL-friendly version
        table.string('color', 7).defaultTo('#00D9FF') // Hex color code
        table.text('description').nullable()
        table.integer('links_count').defaultTo(0) // Cached count for performance
        
        // Timestamps
        table.bigInteger('created_at').notNullable()
        table.bigInteger('updated_at').notNullable()
        
        // Foreign keys
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
        
        // Indexes
        table.index('user_id')
        table.index('slug')
        table.unique(['user_id', 'slug']) // Unique tag per user
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tags')
}
