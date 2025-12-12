import { auth } from "$lib/auth/index";
import { json, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";

const handleAuthRequest = async (request: Request) => {
    console.log(`[${request.method}] ${request.url} - Request received.`);
    try {
        console.log(`[${request.method}] ${request.url} - Calling auth.handler...`);
        const response = await auth.handler(request);
        console.log(`[${request.method}] ${request.url} - auth.handler responded with status: ${response.status}.`);

        // Clone response and add universal cache control headers for all hosting platforms
        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
        responseHeaders.set('Pragma', 'no-cache');
        responseHeaders.set('Expires', '0');
        // Universal CDN headers
        responseHeaders.set('Surrogate-Control', 'no-store');
        responseHeaders.set('CDN-Cache-Control', 'no-store');
        // Platform-specific headers
        responseHeaders.set('Netlify-CDN-Cache-Control', 'no-store');
        responseHeaders.set('Vercel-CDN-Cache-Control', 'no-store');
        responseHeaders.set('Cloudflare-CDN-Cache-Control', 'no-store');
        responseHeaders.set('Fastly-CDN-Cache-Control', 'no-store');
        responseHeaders.set('Akamai-Cache-Control', 'no-store');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });
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
        return json({ error: errorMessage }, {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store',
                'CDN-Cache-Control': 'no-store',
                'Netlify-CDN-Cache-Control': 'no-store',
                'Vercel-CDN-Cache-Control': 'no-store',
                'Cloudflare-CDN-Cache-Control': 'no-store',
                'Fastly-CDN-Cache-Control': 'no-store',
                'Akamai-Cache-Control': 'no-store'
            }
        });
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
