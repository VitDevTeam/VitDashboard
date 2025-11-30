import { redirect } from "@sveltejs/kit";
import { getSession } from "$lib/auth/session";

export async function load({ event }) {
    try {
        const session = await getSession(event);
        
        if (session?.user) {
            return {
                user: session.user
            };
        }
    } catch (error) {
        throw redirect(302, "/login");
    }
}
