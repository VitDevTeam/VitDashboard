import { auth } from "./index";
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getRequestEvent } from "$app/server";
import { db } from "$lib/db/index";

const TEST_USER_ID = "955695820999639120";

export async function getSession(event?: any) {
    console.log('getSession: starting');
    if (env.BYPASS_AUTH === "true") {
        console.log('getSession: BYPASS_AUTH is true, returning test user');
        return {
            session: {
                userId: TEST_USER_ID,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            },
            user: {
                id: TEST_USER_ID,
                name: "Test User",
                email: "test@example.com"
            }
        };
    }

    const e = event ?? getRequestEvent();
    if (!e) {
        console.error('getSession: Unable to get request event');
        throw error(500, "Unable to get request event");
    }

    let headers: Headers | undefined;
    if (e.request?.headers) {
        headers = e.request.headers;
    } else if (e.cookies?.getAll) {
        const all = e.cookies.getAll();
        const cookie = all.map((c: any) => `${c.name}=${encodeURIComponent(c.value)}`).join('; ');
        headers = new Headers({ cookie });
    }

        if (!headers) {
        console.error('getSession: Unable to get request headers');
        throw error(500, "Unable to get request headers");
    }

    console.log('getSession: getting session from auth.api');
    let session;
    try {
        session = await auth.api.getSession({ headers });
    } catch (authError) {
        console.error('getSession: auth api error:', authError);
        throw error(500, "Authentication service unavailable");
    }
    console.log('getSession: session received', { userId: session?.user?.id });

    if (!session) {
        console.error('getSession: session is null, unauthorized');
        throw error(401, "Unauthorized");
    }

        console.log('getSession: getting account from db for user', session.user.id);
    let account;
    try {
        account = await db
            .selectFrom('account')
            .select(['accountId'])
            .where('userId', '=', session.user.id)
            .where('providerId', '=', 'discord')
            .executeTakeFirst();
    } catch (dbError) {
        console.error('getSession: database query error:', dbError);
        throw error(500, "Database service unavailable");
    }
    console.log('getSession: account received', { accountId: account?.accountId });

        if (!account) {
        console.error('getSession: Discord account not found for user', session.user.id);
        throw error(500, "Discord account not found");
    }

    const result = {
        ...session,
        user: {
            ...session.user,
            id: account.accountId
        }
    };
    console.log('getSession: finished, returning session for user', { userId: result.user.id });
    return result;
}

export async function requireAuth(event: any) {
    console.log('requireAuth: starting');
    const session = await getSession(event);
    
        if (!session || !session.user) {
        console.error('requireAuth: Unauthorized, no session or user found');
        throw error(401, "Unauthorized");
    }
    
        console.log('requireAuth: finished, user is authenticated', { userId: session.user.id });
    return session;
}
