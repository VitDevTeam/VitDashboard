import { Client, GatewayIntentBits } from 'discord.js';

let botInstance: Client | null = null;

export async function startBot() {
    if (botInstance) {
        return botInstance;
    }

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers
        ]
    });

    await client.login(process.env.DISCORD_BOT_TOKEN);
    botInstance = client;
    
    return client;
}
