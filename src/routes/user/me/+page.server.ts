import { getUserDiscord } from "$lib/remote/discord.remote";
import { getUserStat, getInventoryWithItems, getUserEffects } from "$lib/remote/db.remote";

export async function load() {
    console.log('/user/me load: starting');
    const [dbStats, userDiscord, inventory, effects] = await Promise.all([
        getUserStat(),
        getUserDiscord(),
        getInventoryWithItems(),
        getUserEffects()
    ]);
    console.log('/user/me load: data fetched', { dbStats, userDiscord, inventory, effects });

        console.log('/user/me load: returning data');
    return {
        userStats: dbStats,
        discordUser: userDiscord[0],
        inventory,
        effects
    };
}
