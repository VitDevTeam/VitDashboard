import { startBot } from "$lib/bot";
import { query } from "$app/server";
import { str } from "$lib/validation";

const bot = await startBot();
const TEST_ID = "1186872689038729237";

export const getUserDiscord = query(async (id: string = TEST_ID) => {
    try {
        const discord_info = await bot.users.fetch(id);
        return [JSON.parse(JSON.stringify(discord_info))];
    } catch (error: any) {
        console.warn('Discord API error, using mock data:', error.message);
        return [{
            id: TEST_ID,
            username: "youngcoder45",
            globalName: "Aditya ✧ YC45",
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

export const getUserGuilds = query(async(id: string = TEST_ID) => {
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
        return userGuilds;
    } catch (error) {
        console.log("Error:", error)
        return [];
    }
});

export const getDiscordGuild = query(str, async (guildId: string) => {
    try {
        const guild = bot.guilds.cache.get(guildId);
        
        if (!guild) {
            return null;
        }
        
        return {
            id: guild.id,
            name: guild.name,
            iconURL: guild.iconURL(),
            memberCount: guild.memberCount,
            description: guild.description,
            ownerId: guild.ownerId
        };
    } catch (error: any) {
        console.log("Error:", error);
        return null;
    }
});
