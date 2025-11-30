import postgres from "postgres";
import fs from "fs";

async function migrate() {
    let url = process.env.DB_URL;
    let sslmode = process.env.PGSSLMODE;
    if (!url) {
        try {
            const envText = fs.readFileSync(".env", "utf8");
            const lines = envText.split(/\r?\n/);
            const map = {};
            for (const line of lines) {
                const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
                if (m) {
                    let v = m[2].trim();
                    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                        v = v.slice(1, -1);
                    }
                    map[m[1]] = v;
                }
            }
            url = map["DB_URL"];
            sslmode = map["PGSSLMODE"] || sslmode;
        } catch {}
    }
    if (!url) {
        console.error("DB_URL is not set");
        process.exit(1);
    }
    const needsNoVerify = (sslmode === 'no-verify') || url.includes('sslmode=require');
    const sql = postgres(url, needsNoVerify ? { ssl: { rejectUnauthorized: false } } : undefined);
    try {
        await sql`CREATE TABLE IF NOT EXISTS "user" (
            "id" TEXT PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "emailVerified" BOOLEAN NOT NULL DEFAULT false,
            "name" TEXT NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "image" TEXT
        )`;

        await sql`CREATE TABLE IF NOT EXISTS "session" (
            "id" TEXT PRIMARY KEY,
            "expiresAt" TIMESTAMP NOT NULL,
            "token" TEXT NOT NULL UNIQUE,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "ipAddress" TEXT,
            "userAgent" TEXT,
            "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
        )`;

        await sql`CREATE TABLE IF NOT EXISTS "account" (
            "id" TEXT PRIMARY KEY,
            "accountId" TEXT NOT NULL,
            "providerId" TEXT NOT NULL,
            "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
            "accessToken" TEXT,
            "refreshToken" TEXT,
            "idToken" TEXT,
            "accessTokenExpiresAt" TIMESTAMP,
            "refreshTokenExpiresAt" TIMESTAMP,
            "scope" TEXT,
            "password" TEXT,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`;

        await sql`CREATE TABLE IF NOT EXISTS "verification" (
            "id" TEXT PRIMARY KEY,
            "identifier" TEXT NOT NULL,
            "value" TEXT NOT NULL,
            "expiresAt" TIMESTAMP NOT NULL,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log("Migration completed successfully");
        await sql.end({ timeout: 1 });
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
