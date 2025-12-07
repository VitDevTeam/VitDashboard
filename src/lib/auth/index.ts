import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { DB_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, AUTH_SECRET } from "$env/static/private";

function stripSslmode(url: string) {
    try {
        const u = new URL(url);
        if (u.searchParams.has('sslmode')) {
            u.searchParams.delete('sslmode');
        }
        return u.toString();
    } catch {
        return url.replace(/([?&])sslmode=[^&]*/i, '$1').replace(/[?&]$/, '');
    }
}

const connectionString = stripSslmode(DB_URL);

export const auth = betterAuth({
    database: new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 5, // max connections
        min: 0, // completely empty
        idleTimeoutMillis: 600000, // idle connections after 10 minutes
        connectionTimeoutMillis: 10000, // oof faster if can't connect
    }),
    secret: AUTH_SECRET,
    socialProviders: {
        discord: {
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET,
            disableDefaultScope: true,
            scope: ['guilds', 'identify']
        }
    }
});
