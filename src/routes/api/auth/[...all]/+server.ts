import { auth } from "$lib/auth/index";
import { json, redirect } from "@sveltejs/kit";

const handleAuthRequest = async (request: Request) => {
    try {
        const response = await auth.handler(request);
        console.log(`${request.method} /api/auth/[...all]: sending response`, { status: response.status });
        return response;
    } catch (error: any) {
        console.error(`${request.method} Auth Error:`, error);
        console.error("Error stack:", error.stack);
        console.error("Error message:", error.message);
        if (error.code === '53300') {
            throw redirect(302, '/auth/error?message=Too many connections');
        }
        return json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
};

export const GET = async ({ request }: any) => {
    console.log('GET /api/auth/[...all]: received request', { url: request.url });
    return handleAuthRequest(request);
};

export const POST = async ({ request }: any) => {
    console.log('POST /api/auth/[...all]: received request', { url: request.url });
    return handleAuthRequest(request);
};
