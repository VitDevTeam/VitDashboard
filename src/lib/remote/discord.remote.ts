import { startBot } from "$lib/bot";
import { query } from "$app/server";
import { str } from "$lib/validation";
import { getSession } from "$lib/auth/session";

const bot = await startBot();

export const getUserDiscord = query(async (id?: string) => {
    console.log(`discord.remote: getUserDiscord called with id: ${id}`);
    if (!id) {
        const session = await getSession();
        id = session?.user?.id || "955695820999639120";
    }
    
    try {
        const discord_info = await bot.users.fetch(id);
        console.log(`discord.remote: getUserDiscord success for id: ${id}`);
        return [JSON.parse(JSON.stringify(discord_info))];
    } catch (error: any) {
        console.error(`discord.remote: getUserDiscord error for id: ${id}. Returning mock data.`, error);
        return [{
            id: id,
            username: "youngcoder45",
            globalName: "Aditya YC45",
            discriminator: "0",
            avatar: "cf296ec1b2af5b10746bb89dbd24fc38",
            avatarURL: "https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp",
            displayAvatarURL: "https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp",
            primaryGuild: {
                tag: "CODE"
            }
        }];
    }
});

export const getUserGuilds = query(async(id?: string) => {
    console.log(`discord.remote: getUserGuilds called with id: ${id}`);
    if (!id) {
        const session = await getSession();
        id = session?.user?.id || "955695820999639120";
    }
    try {
        const userGuilds: any[] = [];
        const allChecks: Promise<void>[] = [];
        
        for(const [_, guild] of bot.guilds.cache) {
            const checkPromise = guild.members.fetch(id)
                .then((mem) => {
                    if(mem) {
                        userGuilds.push({
                            id: guild.id,
                            name: guild.name,
                            iconURL: guild.iconURL(),
                            memberCount: guild.memberCount
                        });
                    }
                })
                .catch(() => {});
            
            allChecks.push(checkPromise);
        }
        
        await Promise.all(allChecks);
        console.log(`discord.remote: getUserGuilds success for id: ${id}`);
        return userGuilds;
    } catch (error) {
        console.error(`discord.remote: getUserGuilds error for id: ${id}. Returning empty array.`, error);
        return [];
    }
});

export const getDiscordGuild = query(str, async (guildId: string) => {
    console.log(`discord.remote: getDiscordGuild called with guildId: ${guildId}`);
    try {
        const guild = bot.guilds.cache.get(guildId);
        
        if (!guild) {
            return null;
        }
        
        const result = {
            id: guild.id,
            name: guild.name,
            iconURL: guild.iconURL(),
            memberCount: guild.memberCount,
            description: guild.description,
            ownerId: guild.ownerId
        };
        console.log(`discord.remote: getDiscordGuild success for guildId: ${guildId}`);
        return result;
    } catch (error: any) {
        console.error(`discord.remote: getDiscordGuild error for guildId: ${guildId}. Returning null.`, error);
        return null;
    }
});

export const getDiscordUser = query(str, async (userId: string) => {
    console.log(`discord.remote: getDiscordUser called with userId: ${userId}`);
    try {
        const user = await bot.users.fetch(userId);
        const result = {
            id: user.id,
            name: user.username,
            avatarURL: user.avatarURL()
        };
        console.log(`discord.remote: getDiscordUser success for userId: ${userId}`);
        return result;
    } catch (error: any) {
        console.error(`discord.remote: getDiscordUser error for userId: ${userId}. Returning null.`, error);
        return null;
    }
});
