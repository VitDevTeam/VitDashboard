import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import { DB_URL } from '$env/static/private';

function shouldNoVerify(url: string) {
  return /[?&]sslmode=require/i.test(url) || process.env.PGSSLMODE === 'no-verify';
}
import type { Database } from './types';


export const sql = postgres(DB_URL, shouldNoVerify(DB_URL) ? { max: 2, ssl: { rejectUnauthorized: false } } : { max: 2 });


export const dialect = new PostgresJSDialect({ postgres: sql });

export const db = new Kysely<Database>({ dialect });

export * from './types';
