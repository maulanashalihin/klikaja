import { Knex } from "knex";

/**
 * KlikAja - Link Claims Table Migration
 * Tracks claim tokens for anonymous links
 * Tokens expire after a certain period
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('link_claims', function (table) {
        table.uuid('id').primary().notNullable()
        
        // Link relationship
        table.uuid('link_id').notNullable()
        table.foreign('link_id').references('links.id').onDelete('CASCADE')
        
        // Claim token
        table.string('claim_token', 100).unique().notNullable()
        
        // Expiration
        table.bigInteger('expires_at').notNullable()
        
        // Timestamp
        table.bigInteger('created_at').notNullable()
        
        // Indexes
        table.index('claim_token') // For fast token lookup
        table.index('link_id')
        table.index('expires_at') // For cleanup of expired tokens
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('link_claims')
}
