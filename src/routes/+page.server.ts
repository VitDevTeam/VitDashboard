import { getSession } from "$lib/auth/session";

export async function load({ event }) {
    try {
        const session = await getSession(event);

        if (session?.user) {
            return {
                user: session.user,
                dbStatus: 'connected'
            };
        }
    } catch (error) {
        console.warn('Database/auth service unavailable, showing offline mode:', error.message);
        // Show page in offline mode
        return {
            user: null,
            dbStatus: 'offline',
            error: error.message
        };
    }

    return {
        user: null,
        dbStatus: 'connected'
    };
}
