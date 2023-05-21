import type { Kysely } from 'kysely';
import { sql } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
    // Users
    await db.schema
        .createTable('users')
        .ifNotExists()
        .addColumn('id', 'varchar(36)', col => col.defaultTo(sql`(uuid())`).primaryKey().notNull())
        .execute();

    // Envs
    await db.schema
        .createTable('envs')
        .ifNotExists()
        .addColumn('id', 'varchar(36)', col => col.defaultTo(sql`(uuid())`).primaryKey().notNull())
        .addColumn('user_id', 'varchar(36)', col => col.notNull())
        .addColumn('name', 'varchar(256)', col => col.notNull())
        .addColumn('iv', 'varchar(256)', col => col.notNull())
        .addColumn('salt', 'varchar(256)', col => col.notNull())
        .addColumn('data', 'blob', col => col.notNull())
        .addUniqueConstraint('user_id_name_unique', ['user_id', 'name'])
        .execute();
};

export const down = async (db: Kysely<unknown>) => {
    await db.schema.dropTable('envs').execute();
};
