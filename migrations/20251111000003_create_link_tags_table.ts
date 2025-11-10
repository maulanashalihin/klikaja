import { Knex } from "knex";

/**
 * KlikAja - Link Tags Pivot Table Migration
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * Many-to-many relationship between links and tags
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('link_tags', function (table) {
        table.uuid('link_id').notNullable()
        table.uuid('tag_id').notNullable()
        
        // Timestamp when tag was applied
        table.bigInteger('created_at').notNullable()
        
        // Foreign keys
        table.foreign('link_id').references('id').inTable('links').onDelete('CASCADE')
        table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE')
        
        // Composite primary key
        table.primary(['link_id', 'tag_id'])
        
        // Indexes
        table.index('link_id')
        table.index('tag_id')
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('link_tags')
}
