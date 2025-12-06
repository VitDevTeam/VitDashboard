import { auth } from "$lib/auth/index";
import { json } from "@sveltejs/kit";

export const GET = async ({ request }: any) => {
    console.log('GET /api/auth/[...all]: received request', { url: request.url });
    try {
        const response = await auth.handler(request);
        console.log('GET /api/auth/[...all]: sending response', { status: response.status });
        return response;
    } catch (error: any) {
        console.error("GET Auth Error:", error);
        console.error("Error stack:", error.stack);
        console.error("Error message:", error.message);
        return json({ error: error.message }, { status: 500 });
    }
};

export const POST = async ({ request }: any) => {
    console.log('POST /api/auth/[...all]: received request', { url: request.url });
    try {
        const response = await auth.handler(request);
        console.log('POST /api/auth/[...all]: sending response', { status: response.status });
        return response;
    } catch (error: any) {
        console.error("POST Auth Error:", error);
        console.error("Error stack:", error.stack);
        console.error("Error message:", error.message);
        console.error("Error cause:", error.cause);
        return json({ error: error.message }, { status: 500 });
    }
};
