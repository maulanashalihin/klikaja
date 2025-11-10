import { Knex } from "knex";

/**
 * KlikAja - Add Folder to Links Table
 * Phase 2: Enhanced Features - Folders & Tags Organization
 * Adds folder_id column to links table for folder organization
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('links', function (table) {
        table.uuid('folder_id').nullable().after('user_id')
        
        // Foreign key
        table.foreign('folder_id').references('id').inTable('folders').onDelete('SET NULL')
        
        // Index for filtering by folder
        table.index('folder_id')
        table.index(['user_id', 'folder_id']) // For user's links in specific folder
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('links', function (table) {
        table.dropForeign(['folder_id'])
        table.dropIndex(['folder_id'])
        table.dropIndex(['user_id', 'folder_id'])
        table.dropColumn('folder_id')
    })
}
