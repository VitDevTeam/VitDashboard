import { env } from "$env/dynamic/private";

if (env.BYPASS_AUTH === "true") {
    console.warn("[!] BYPASS_AUTH is enabled - using test user for all requests. Turn it off by removing BYPASS_AUTH from .env or set BYPASS_AUTH to false");
}

export async function handle({ event, resolve }) {
    const theme = event.cookies.get('theme') || 'dark';
    event.locals.theme = theme;

    return resolve(event, {
        transformPageChunk: ({ html }) => {
            return html.replace('data-theme="dark"', `data-theme="${theme}"`);
        }
    });
}
