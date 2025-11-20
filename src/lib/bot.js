import { Client, GatewayIntentBits } from 'discord.js';
import { DISCORD_TOKEN } from '$env/static/private';

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

bot.once('ready', () => {
    console.log('Bot is online as', bot.user.tag);
});


let started = false;

export async function startBot() {
    if (!started) {
        started = true;
        await bot.login(DISCORD_TOKEN);
    }
    return bot;
}
