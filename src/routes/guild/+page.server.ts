import { getSession } from "$lib/auth/session";
import { startBot } from "$lib/bot";

const bot = await startBot();

export async function load() {
    const session = await getSession();
    const userId = session.user.id;
    
    const userGuilds = [];
    
    for (const [_, guild] of bot.guilds.cache) {
        try {
            const member = await guild.members.fetch(userId);
            
            if (member ) {
                userGuilds.push({
                    id: guild.id,
                    name: guild.name,
                    iconURL: guild.iconURL(),
                    memberCount: guild.memberCount,
                    isOwner: true
                });
            }
        } catch {
            // User not in this guild
        }
    }
    
    return {
        servers: userGuilds
    };
}
