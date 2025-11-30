import { auth } from "$lib/auth/index";
import { json } from "@sveltejs/kit";

export const GET = async ({ request }: any) => {
    try {
        return await auth.handler(request);
    } catch (error: any) {
        console.error("GET Auth Error:", error);
        console.error("Error stack:", error.stack);
        console.error("Error message:", error.message);
        return json({ error: error.message }, { status: 500 });
    }
};

export const POST = async ({ request }: any) => {
    try {
        return await auth.handler(request);
    } catch (error: any) {
        console.error("POST Auth Error:", error);
        console.error("Error stack:", error.stack);
        console.error("Error message:", error.message);
        console.error("Error cause:", error.cause);
        return json({ error: error.message }, { status: 500 });
    }
};
