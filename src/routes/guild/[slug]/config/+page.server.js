import { db } from '$lib/db/index';
import { error } from '@sveltejs/kit';
import { getSession } from '$lib/auth/session';
import { startBot } from '$lib/bot';

const bot = await startBot();

export const load = async ({ params }) => {
    const session = await getSession();
    const userId = session.user.id;
    
    const guild = bot.guilds.cache.get(params.slug);
    
    if (!guild) {
        throw error(404, 'Guild not found');
    }
    
    if (guild.ownerId !== userId) {
        throw error(403, 'Only the guild owner can access settings');
    }
    
    let config = await db
        .selectFrom('guild_config')
        .select(['guild_id', 'prefix', 'allow_rob'])
        .where('guild_id', '=', params.slug)
        .executeTakeFirst();
    
    if (!config || !config.prefix) {
        const defaultPrefix = '!';
        
        if (!config) {
            await db
                .insertInto('guild_config')
                .values({ guild_id: params.slug, prefix: defaultPrefix, allow_rob: true })
                .execute();
        } else {
            await db
                .updateTable('guild_config')
                .set({ prefix: defaultPrefix })
                .where('guild_id', '=', params.slug)
                .execute();
        }
        
        config = { guild_id: params.slug, prefix: defaultPrefix, allow_rob: config?.allow_rob ?? true };
    }

    return { 
        config,
        guild: {
            id: guild.id,
            name: guild.name,
            iconURL: guild.iconURL()
        }
    };
};

export const actions = {
    default: async ({ request, params }) => {
        const session = await getSession();
        const userId = session.user.id;
        
        const guild = bot.guilds.cache.get(params.slug);
        
        if (!guild) {
            throw error(404, 'Guild not found');
        }
        
        if (guild.ownerId !== userId) {
            throw error(403, 'Only the guild owner can modify settings');
        }
        
        const formData = await request.formData();
        const prefix = formData.get('prefix');
        const allow_rob = formData.get('allow_rob') === 'true';

        try {
            await db
                .updateTable('guild_config')
                .set({ prefix, allow_rob })
                .where('guild_id', '=', params.slug)
                .execute();

            return { success: true };
        } catch (err) {
            console.warn('Update error:', err.message);
            throw error(500, 'Failed to update config');
        }
    }
};
