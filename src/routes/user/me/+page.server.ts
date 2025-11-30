import { getUserDiscord } from "$lib/remote/discord.remote";
import { getUserStat, getInventoryWithItems, getUserEffects } from "$lib/remote/db.remote";

export async function load() {
    const [dbStats, userDiscord, inventory, effects] = await Promise.all([
        getUserStat(),
        getUserDiscord(),
        getInventoryWithItems(),
        getUserEffects()
    ]);

    return {
        userStats: dbStats,
        discordUser: userDiscord[0],
        inventory,
        effects
    };
}
