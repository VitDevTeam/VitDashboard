import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import { DB_URL } from '$env/static/private';

function shouldNoVerify(url: string) {
  return /[?&]sslmode=require/i.test(url) || process.env.PGSSLMODE === 'no-verify';
}
import type { Database } from './types';

class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

export const dbCache = new MemoryCache();
setInterval(() => dbCache.cleanup(), 5 * 60 * 1000);

// Query performance monitoring
const queryStats = new Map<string, { count: number; totalTime: number; avgTime: number }>();

export function logQueryPerformance(queryType: string, startTime: number) {
  const duration = Date.now() - startTime;
  const existing = queryStats.get(queryType) || { count: 0, totalTime: 0, avgTime: 0 };

  existing.count++;
  existing.totalTime += duration;
  existing.avgTime = existing.totalTime / existing.count;

  queryStats.set(queryType, existing);

  if (duration > 1000) { // Log slow queries (>1 second)
    console.warn(`Slow query detected: ${queryType} took ${duration}ms`);
  }
}

export function getQueryStats() {
  return Object.fromEntries(queryStats);
}

// Create connection with error handling
let sqlConnection: any = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

function createConnection() {
    try {
        connectionAttempts++;
        console.log(`Creating database connection (attempt ${connectionAttempts})`);

        const options = shouldNoVerify(DB_URL) ? {
            max: 1, 
            idle_timeout: 10, 
            connect_timeout: 3, 
            ssl: { rejectUnauthorized: false },
            onnotice: () => {}, 
            onparameter: () => {}
        } : {
            max: 1, 
            idle_timeout: 10, 
            connect_timeout: 3 
        };

        sqlConnection = postgres(DB_URL, options);
        connectionAttempts = 0; // reset if suces
        return sqlConnection;
    } catch (error) {
        console.error(`Database connection attempt ${connectionAttempts} failed:`, error);

        if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
            console.log(`Retrying connection in 1 second...`);
            setTimeout(createConnection, 1000);
        } else {
            console.error('Max connection attempts reached. Database unavailable.');
            throw error;
        }
    }
}

// Initialize connection
createConnection();

export const sql = sqlConnection;

export const dialect = new PostgresJSDialect({ postgres: sql });
export const db = new Kysely<Database>({ dialect });

export * from './types';
