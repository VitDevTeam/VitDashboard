import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import { DB_URL } from '$env/static/private';
import type { Database } from './types';


const sql = postgres(DB_URL, { 
    max: 3,
    
});


export const db = new Kysely<Database>({
    dialect: new PostgresJSDialect({
        postgres: sql
    })
});

export * from './types';
