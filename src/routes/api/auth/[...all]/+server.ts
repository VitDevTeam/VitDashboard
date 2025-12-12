import { auth } from "$lib/auth/index";
import { json, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";

const handleAuthRequest = async (request: Request) => {
    console.log(`[${request.method}] ${request.url} - Request received.`);
    try {
        console.log(`[${request.method}] ${request.url} - Calling auth.handler...`);
        const response = await auth.handler(request);
        console.log(`[${request.method}] ${request.url} - auth.handler responded with status: ${response.status}.`);
        return response;
    } catch (error: any) {
        console.error(`[${request.method}] ${request.url} - Auth Error:`, error);
        console.error(`[${request.method}] ${request.url} - Error Code:`, error.code);
        console.error(`[${request.method}] ${request.url} - Error Message:`, error.message);
        console.error(`[${request.method}] ${request.url} - Error Stack:`, error.stack);
        if (error.code === '53300') {
            console.log(`[${request.method}] ${request.url} - Redirecting due to too many connections.`);
            throw redirect(302, '/auth/error?message=Too many connections');
        }
        const errorMessage = dev ? error.message : 'An unexpected error occurred';
        return json({ error: errorMessage }, { status: 500 });
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
