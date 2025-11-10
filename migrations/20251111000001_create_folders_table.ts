import { Knex } from "knex";

/**
 * KlikAja - Folders Table Migration
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * Allows users to organize their links into folders
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('folders', function (table) {
        table.uuid('id').primary().notNullable()
        table.uuid('user_id').notNullable()
        table.string('name', 255).notNullable()
        table.string('color', 7).defaultTo('#FF6B35') // Hex color code
        table.string('icon', 50).nullable() // Icon name (e.g., 'folder', 'briefcase', 'star')
        table.text('description').nullable()
        table.integer('position').defaultTo(0) // For custom ordering
        
        // Timestamps
        table.bigInteger('created_at').notNullable()
        table.bigInteger('updated_at').notNullable()
        
        // Foreign keys
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
        
        // Indexes
        table.index('user_id')
        table.index(['user_id', 'position']) // For ordered listing
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('folders')
}
