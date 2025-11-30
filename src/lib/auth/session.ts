import { auth } from "./index";
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getRequestEvent } from "$app/server";
import { db } from "$lib/db/index";

const TEST_USER_ID = "955695820999639120";

export async function getSession(event?: any) {
    if (env.BYPASS_AUTH === "true") {
        
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

    if (!event) {
        event = getRequestEvent();
    }

    let headers: Headers | undefined;
    if (event?.request?.headers) {
        headers = event.request.headers;
    } else if (event?.cookies?.getAll) {
        const all = event.cookies.getAll();
        const cookie = all.map((c: any) => `${c.name}=${encodeURIComponent(c.value)}`).join('; ');
        headers = new Headers({ cookie });
    }

    if (!headers) {
        throw error(500, "Unable to get request headers");
    }

    const session = await auth.api.getSession({ headers });

    if (!session) {
        throw error(401, "Unauthorized");
    }

    const account = await db
        .selectFrom('account')
        .select(['accountId'])
        .where('userId', '=', session.user.id)
        .where('providerId', '=', 'discord')
        .executeTakeFirst();

    if (!account) {
        throw error(500, "Discord account not found");
    }

    return {
        ...session,
        user: {
            ...session.user,
            id: account.accountId
        }
    };
}

export async function requireAuth(event: any) {
    const session = await getSession(event);
    
    if (!session || !session.user) {
        throw error(401, "Unauthorized");
    }
    
    return session;
}
