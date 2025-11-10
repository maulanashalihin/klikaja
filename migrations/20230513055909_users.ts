import { Knex } from "knex";

/**
 * KlikAja - Users Table Migration
 * Stores user accounts for authenticated features
 */
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().notNullable()
        table.string('name', 255).notNullable()
        table.string('email', 255).unique().notNullable()
        table.string('password', 180).notNullable()
        table.string('phone', 255).nullable()
        table.enum('role', ['admin', 'editor', 'viewer']).defaultTo('editor')
        table.boolean('is_verified').defaultTo(false)
        table.boolean('is_admin').defaultTo(false)
        table.string('remember_me_token').nullable()
        table.dateTime('membership_date').nullable()
        
        // Timestamps
        table.bigInteger('created_at').notNullable()
        table.bigInteger('updated_at').notNullable()
        
        // Indexes
        table.index('email')
    }) 
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

