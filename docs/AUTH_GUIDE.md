# Authentication Guide

This guide explains how authentication works in this application and how to use it.

## Overview

The app uses **Better Auth** with Discord OAuth for authentication. User sessions are stored in PostgreSQL, and the Discord ID is used throughout the app to identify users.

## Authentication Flow

### 1. User Login
```
User clicks "Login with Discord" 
  → Redirects to Discord OAuth
  → Discord authenticates user
  → Redirects back to /api/auth/callback/discord
  → Better Auth creates session
  → User redirected to /user/me
```

### 2. Session Management
- Better Auth stores sessions in the `session` table
- User info stored in the `user` table
- Discord account linked in the `account` table
- Sessions expire after 7 days by default

### 3. Discord ID Resolution
When you call `getSession()`:
1. Retrieves Better Auth session from cookies
2. Gets the Better Auth `userId` from session
3. Queries `account` table to find Discord `accountId`
4. Returns session with Discord ID as `user.id`

This means `session.user.id` is always the Discord snowflake ID, not the Better Auth internal ID.

## Using Authentication

### In Remote Functions

Remote functions automatically have access to the request context:

```typescript
import { query } from '$app/server';
import { getSession } from '$lib/auth/session';

export const getMyData = query(async () => {
    const session = await getSession();
    const discordId = session.user.id; // Discord snowflake ID
    
    // Use discordId to query your database
    const data = await db
        .selectFrom('users')
        .where('id', '=', discordId)
        .executeTakeFirst();
    
    return data;
});
```

### In Server Load Functions

```typescript
// +page.server.ts
import { getSession } from '$lib/auth/session';

export async function load({ request }) {
    const session = await getSession({ request });
    
    return {
        userId: session.user.id,
        userName: session.user.name
    };
}
```

### In API Routes

```typescript
// +server.ts
import { getSession } from '$lib/auth/session';
import { json } from '@sveltejs/kit';

export async function GET({ request }) {
    const session = await getSession({ request });
    
    return json({
        userId: session.user.id
    });
}
```

### On the Client

```svelte
<script>
    import { useSession } from '$lib/auth-client';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    let sessionData = $state(null);
    
    onMount(() => {
        if (browser) {
            const sessionStore = useSession();
            const unsubscribe = sessionStore.subscribe((value) => {
                sessionData = value;
            });
            return unsubscribe;
        }
    });
</script>

{#if sessionData?.data?.user}
    <p>Welcome, {sessionData.data.user.name}!</p>
    <p>Your Discord ID: {sessionData.data.user.id}</p>
{:else}
    <p>Not logged in</p>
{/if}
```

**Important:** The client-side session structure is different from server-side:
- Server: `session.user.id` 
- Client: `sessionData.data.user.id` 

## BYPASS_AUTH Mode

For development, you can bypass authentication:

### Setup

Add to your `.env` file:
```env
BYPASS_AUTH=true
```

### Behavior

When `BYPASS_AUTH=true`:
- `getSession()` returns a mock session
- Default test user ID: `955695820999639120`
- No Discord OAuth required
- No database session lookup

### Mock Session Structure

```typescript
{
    session: {
        userId: "955695820999639120",
        expiresAt: Date (7 days from now)
    },
    user: {
        id: "955695820999639120",
        name: "Test User",
        email: "test@example.com"
    }
}
```

### When to Use

- Local development without Discord app setup
- Testing without real user accounts
- CI/CD pipelines
- Unit tests

### Important Notes

**Never enable BYPASS_AUTH in production!**

To disable, either:
- Remove `BYPASS_AUTH` from `.env`
- Set `BYPASS_AUTH=false`

## Common Patterns

### Optional User ID Parameter

Many remote functions accept an optional ID parameter:

```typescript
export const getUserData = query(async (id?: string) => {
    if (!id) {
        const session = await getSession();
        id = session.user.id;
    }
    
    // Use id...
});
```

This allows:
- Calling without params: `getUserData()` → uses logged-in user
- Calling with params: `getUserData("123456")` → uses specific user

### Error Handling

```typescript
import { error } from '@sveltejs/kit';

try {
    const session = await getSession();
    // Use session...
} catch (err) {
    if (err.status === 401) {
        // User not logged in
        throw error(401, 'Please log in');
    }
    throw err;
}
```

### Protecting Routes

Create a `+page.server.ts` that requires auth:

```typescript
import { getSession } from '$lib/auth/session';

export async function load() {
    // This will throw 401 if not authenticated
    const session = await getSession();
    
    return {
        user: session.user
    };
}
```

If the user isn't logged in, they'll see the error page.

## Database Schema

### Better Auth Tables

```sql
-- User account
CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    "emailVerified" BOOLEAN DEFAULT false,
    image TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Active sessions
CREATE TABLE session (
    id TEXT PRIMARY KEY,
    "expiresAt" TIMESTAMP NOT NULL,
    token TEXT NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "user"(id),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- OAuth accounts (Discord, etc)
CREATE TABLE account (
    id TEXT PRIMARY KEY,
    "accountId" TEXT NOT NULL,      -- Discord snowflake ID
    "providerId" TEXT NOT NULL,     -- "discord"
    "userId" TEXT NOT NULL REFERENCES "user"(id),
    "accessToken" TEXT,
    "refreshToken" TEXT,
    scope TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
```

### Your App Tables

Your app tables use Discord IDs (bigint):

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,  -- Discord snowflake ID
    coins TEXT DEFAULT '0',
    energy TEXT DEFAULT '100',
    energy_max TEXT DEFAULT '100',
    mood TEXT DEFAULT '100',
    mood_max TEXT DEFAULT '100'
);
```

## Configuration Files

### Better Auth Config

`src/lib/auth/index.ts`:
```typescript
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({ connectionString: DB_URL }),
    secret: AUTH_SECRET,
    socialProviders: {
        discord: {
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET
        }
    }
});
```

### Client Config

`src/lib/auth-client.ts`:
```typescript
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient();
export const { signIn, signOut, useSession } = authClient;
```

## Environment Variables

Required in `.env`:

```env
# Database
DB_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Better Auth
AUTH_SECRET=your-random-secret-key-here

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Development only
BYPASS_AUTH=false
```

## Troubleshooting

### "Headers is required" Error
- Make sure you're calling `getSession()` without arguments in remote functions
- The function will automatically get the request context

### "Discord account not found" Error
- User logged in but no Discord account linked
- Check the `account` table for the user
- User may need to log out and log back in

### Session Not Persisting
- Check cookies are being set correctly
- Verify `AUTH_SECRET` is set
- Check database connection

### Wrong User ID
- If you're getting Better Auth IDs instead of Discord IDs
- Verify `getSession()` is querying the `account` table
- Check `providerId = 'discord'` in the query

## Best Practices

1. **Always use `getSession()` for auth checks**
   - Don't try to parse cookies manually
   - Don't store user IDs in localStorage

2. **Use server-side auth for sensitive operations**
   - Never trust client-side session data
   - Always verify on the server

3. **Handle auth errors gracefully**
   - Redirect to login on 401
   - Show friendly error messages

4. **Keep Discord ID as the primary key**
   - Use Discord snowflake IDs in your tables
   - Don't expose Better Auth internal IDs

5. **Test with BYPASS_AUTH**
   - Develop faster without OAuth
   - Remember to test with real auth before deploying

## Migration from Old Auth

If you're migrating from a different auth system:

1. Export user data with Discord IDs
2. Create Better Auth tables
3. Import users into `user` table
4. Create `account` records linking Discord IDs
5. Users will need to log in once to create sessions

See `scripts/migrate-auth.js` for an example migration script.
