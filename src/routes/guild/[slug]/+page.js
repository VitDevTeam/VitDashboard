import { getGuild } from "$lib/remote/db.remote";

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    const info = await getGuild(params.slug, { fetch });
    return { info };
}
