import { query } from '$app/server';
import { db, dbCache, logQueryPerformance } from "$lib/db/index";
import type { UsersTable, InventoryTable, ItemsTable } from "$lib/db/types";
import { leaderboardParams, num, str, buyMarketParams, marketListingsParams } from "$lib/validation";
import { getSession } from "$lib/auth/session";
import { startBot } from '$lib/bot';

const mockUserStat: UsersTable = {
    id: "955695820999639120",
    guild_id: "mock_guild",
    coins: "100000",
    energy: "54",
    energy_max: "100",
    mood: "100",
    mood_max: "100"
};

const mockItems: Record<number, ItemsTable> = {
    1: { id: 1, name: "bread", description: "Can feed your stomach.", icon: ":bread:", is_usable: true },
    4: { id: 4, name: "wallet lock", description: "easily protect your wallet from being robbed for 5 hour.", icon: ":lock:", is_usable: true },
    8: { id: 8, name: "game kit", description: "An item required to play minigames", icon: ":one:", is_usable: false },
    14: { id: 14, name: "rice ear", description: "ear of rice, you can make rice from it", icon: ":ear_of_rice:", is_usable: false }
};

export const getUserStat = query(async (id?: string) => {
    console.log(`db.remote: getUserStat called with id: ${id}`);
    if (!id) {
        const session = await getSession();
        id = session?.user?.id || "955695820999639120";
    }

    const cacheKey = `userstat_${id}`;
    const cached = dbCache.get(cacheKey);
    if (cached) {
        console.log(`db.remote: getUserStat cache hit for id: ${id}`);
        return cached;
    }

    try {
        const user = await db
            .selectFrom('users')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        const result = user || mockUserStat;
        dbCache.set(cacheKey, result, 60); // Cache for 1 minute

        console.log(`db.remote: getUserStat success for id: ${id}`);
        return result;
    } catch (error: any) {
        console.error(`db.remote: getUserStat error for id: ${id}. Returning mock data.`, error);
        return mockUserStat;
    }
});


export const getInventory = query(async (id?: string) => {
    console.log(`db.remote: getInventory called with id: ${id}`);
    if (!id) {
        const session = await getSession();
        id = session?.user?.id || "955695820999639120";
    }
    try {
        const inventory = await db
            .selectFrom('inventory')
            .selectAll()
            .where('id', '=', id)
            .execute();
        
        console.log(`db.remote: getInventory success for id: ${id}`);
        return inventory;
    } catch (error: any) {
        console.error(`db.remote: getInventory error for id: ${id}. Returning mock data.`, error);
        return [
            {id: id, item_id: 1, quantity: 110},
            {id: id, item_id: 2, quantity: 0},
            {id: id, item_id: 3, quantity: 0},
            {id: id, item_id: 4, quantity: 52},
            {id: id, item_id: 5, quantity: 0},
            {id: id, item_id: 6, quantity: 0},
            {id: id, item_id: 7, quantity: 0},
            {id: id, item_id: 8, quantity: 444},
            {id: id, item_id: 9, quantity: 0},
            {id: id, item_id: 10, quantity: 0},
            {id: id, item_id: 11, quantity: 0},
            {id: id, item_id: 12, quantity: 0},
            {id: id, item_id: 13, quantity: 0},
            {id: id, item_id: 14, quantity: 5},
            {id: id, item_id: 15, quantity: 0},
            {id: id, item_id: 16, quantity: 0},
            {id: id, item_id: 17, quantity: 0},
            {id: id, item_id: 18, quantity: 0},
            {id: id, item_id: 26, quantity: 0}
        ] as InventoryTable[];
    }
});

export const getItem = query.batch(num, async (item_ids: number[]) => {
    console.log(`db.remote: getItem called with item_ids: ${item_ids.join(', ')}`);
    try {
        const items = await db
            .selectFrom('items')
            .selectAll()
            .where('id', 'in', item_ids)
            .execute();
        
        const lookup = new Map(items.map(item => [item.id, item]));
        
        console.log(`db.remote: getItem success for item_ids: ${item_ids.join(', ')}`);
        return (item_id: number) => {
            return lookup.get(item_id) || {
                id: item_id,
                name: `Item #${item_id}`,
                description: "Unknown item",
                icon: ":)",
                is_usable: false
            } as ItemsTable;
        };
    } catch (error: any) {
        console.error(`db.remote: getItem error for item_ids: ${item_ids.join(', ')}. Returning mock data.`, error);
        return (item_id: number) => mockItems[item_id] || {
            id: item_id,
            name: `Item #${item_id}`,
            description: "Unknown item",
            icon: ":)",
            is_usable: false
        } as ItemsTable;
    }
});

export const getAllItems = query(async () => {
    console.log('db.remote: getAllItems called');

    const cacheKey = 'all_items';
    const cached = dbCache.get(cacheKey);
    if (cached) {
        console.log('db.remote: getAllItems cache hit');
        return cached;
    }

    try {
        const items = await db
            .selectFrom('items')
            .selectAll()
            .execute();

        const itemsDict: Record<number, ItemsTable> = {};
        for (const item of items) {
            itemsDict[item.id] = item;
        }

        dbCache.set(cacheKey, itemsDict, 300); // Cache for 5 minutes

        console.log('db.remote: getAllItems success');
        return itemsDict;
    } catch (error: any) {
        console.error('db.remote: getAllItems error. Returning mock data.', error);
        return mockItems;
    }
});

export const getInventoryWithItems = query(async (id?: string) => {
    console.log(`db.remote: getInventoryWithItems called with id: ${id}`);
    if (!id) {
        const session = await getSession();
        id = session?.user?.id || "955695820999639120";
    }
    try {
        const inventory = await db
            .selectFrom('inventory')
            .innerJoin('items', 'inventory.item_id', 'items.id')
            .select([
                'inventory.id',
                'inventory.item_id',
                'inventory.quantity',
                'items.name',
                'items.description',
                'items.icon',
                'items.is_usable'
            ])
            .where('inventory.id', '=', id)
            .execute();
        
        console.log(`db.remote: getInventoryWithItems success for id: ${id}`);
        return inventory;
    } catch (error: any) {
        console.error(`db.remote: getInventoryWithItems error for id: ${id}. Returning empty array.`, error);
        return [];
    }
});

export const getUserEffects = query(async (id?: string) => {
    console.log(`db.remote: getUserEffects called with id: ${id}`);
    if (!id) {
        const session = await getSession();
        id = session?.user?.id || "955695820999639120";
    }
    try {
        const effects = await db
            .selectFrom('current_effects')
            .innerJoin('user_effects', 'current_effects.effect_id', 'user_effects.id')
            .select([
                'current_effects.id',
                'current_effects.applied_at',
                'current_effects.duration',
                'user_effects.name',
                'user_effects.description',
                'user_effects.icon'
            ])
            .where('current_effects.user_id', '=', id)
            .execute();
        
        const result = effects.map(effect => {
            const appliedAt = new Date(effect.applied_at).getTime();
            const durationMs = effect.duration * 30000;
            const endDate = new Date(appliedAt + durationMs);
            
            return {
                ...effect,
                endDate: endDate.toISOString()
            };
        });
        console.log(`db.remote: getUserEffects success for id: ${id}`);
        return result;
    } catch (error: any) {
        console.error(`db.remote: getUserEffects error for id: ${id}. Returning empty array.`, error);
        return [];
    }
});

export const getLocalCoinsLeaderboard = query(leaderboardParams, async (params) => {
    const { id, top, order } = params;
    const startTime = Date.now();
    console.log(`db.remote: getLocalCoinsLeaderboard called with id: ${id}, top: ${top}, order: ${order}`);

    const cacheKey = `leaderboard_${id}_${top}_${order}`;
    const cached = dbCache.get(cacheKey);
    if (cached) {
        console.log(`db.remote: getLocalCoinsLeaderboard cache hit for id: ${id}`);
        logQueryPerformance('getLocalCoinsLeaderboard_cached', startTime);
        return cached;
    }

    try {
        const guild = (await startBot()).guilds.cache.get(id);
        if (!guild) {
            console.error(`db.remote: Guild with id ${id} not found.`);
            return [];
        }

        // Optimized approach: Get member IDs more efficiently
        const memberIds = [];
        try {
            // Get members in chunks to avoid rate limits
            const members = await guild.members.fetch();
            members.forEach(member => memberIds.push(member.id));
        } catch (error) {
            console.error(`Failed to fetch guild members: ${error}`);
            return [];
        }

        if (memberIds.length === 0) {
            return [];
        }

        // Use database ORDER BY instead of in-memory sort for better performance
        const orderDirection = order === 'desc' ? 'desc' : 'asc';
        const users = await db
            .selectFrom('users')
            .select(['id', 'coins'])
            .where('id', 'in', memberIds)
            .where('guild_id', '=', id) // Ensure users are from the correct guild
            .orderBy('coins', orderDirection)
            .limit(top)
            .execute();

        const result = users.map((user, index) => ({
            user_id: user.id,
            coins: user.coins,
            pos: index + 1
        }));

        // Cache for 2 minutes since leaderboard data changes frequently
        dbCache.set(cacheKey, result, 120);

        console.log(`db.remote: getLocalCoinsLeaderboard success for id: ${id}`);
        logQueryPerformance('getLocalCoinsLeaderboard_db', startTime);
        return result;
    } catch (error: any) {
        console.error(`db.remote: getLocalCoinsLeaderboard error for id: ${id}. Returning empty array.`, error);
        return [];
    }
});
export const getGuild = query(str, async (id: string) => {
    console.log(`db.remote: getGuild called with id: ${id}`);
    try {
        let info = await db
            .selectFrom('guilds')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        if (!info) {
            await db
                .insertInto('guilds')
                .values({ id })
                .execute();

            info = await db
                .selectFrom('guilds')
                .selectAll()
                .where('id', '=', id)
                .executeTakeFirst();
        }

        const allGuilds = await db
            .selectFrom('guilds')
            .select(['id', 'coins'])
            .execute();

        const sorted = allGuilds.sort((a, b) => {
            const coinsA = BigInt(a.coins);
            const coinsB = BigInt(b.coins);
            return coinsB > coinsA ? 1 : coinsB < coinsA ? -1 : 0;
        });

        const rank = sorted.findIndex(g => g.id === id) + 1;

        const result = {
            guild_id: info.id,
            coins: info.coins,
            rank
        };
        console.log(`db.remote: getGuild success for id: ${id}`);
        return result;
    } catch (error: any) {
        console.error(`db.remote: getGuild error for id: ${id}. Returning null.`, error);
        return null;
    }
});

export const getMarketListings = query(marketListingsParams, async (params) => {
    const { search, category, page, limit } = params;
    console.log('db.remote: getMarketListings called with params:', { search, category, page, limit });

    try {
        let query = db
            .selectFrom('trades')
            .innerJoin('items', 'trades.item_id', 'items.id')
            .select([
                'trades.id',
                'trades.offerer_id',
                'trades.item_id',
                'trades.quantity',
                'trades.price',
                'trades.created_at',
                'items.name',
                'items.description',
                'items.icon',
                'items.is_usable'
            ]);

        if (search && search.trim()) {
            query = query.where('items.name', 'ilike', `%${search.trim()}%`);
        }

        if (category && category !== 'all') {
            const isUsable = category === 'Usable';
            query = query.where('items.is_usable', '=', isUsable);
        }

        let countQuery = db
            .selectFrom('trades')
            .innerJoin('items', 'trades.item_id', 'items.id')
            .select((eb) => eb.fn.count('trades.id').as('count'));

        if (search && search.trim()) {
            countQuery = countQuery.where('items.name', 'ilike', `%${search.trim()}%`);
        }

        if (category && category !== 'all') {
            const isUsable = category === 'Usable';
            countQuery = countQuery.where('items.is_usable', '=', isUsable);
        }

        const totalCount = await countQuery.executeTakeFirst();

        const offset = (page - 1) * limit;
        const trades = await query
            .orderBy('trades.created_at', 'desc')
            .limit(limit)
            .offset(offset)
            .execute();

        console.log('db.remote: getMarketListings found', trades.length, 'trades out of', totalCount?.count || 0);

        const sellerUsernames = new Map();
        try {
            const bot = await startBot();
            for (const trade of trades) {
                try {
                    const user = await bot.users.fetch(trade.offerer_id);
                    sellerUsernames.set(trade.offerer_id, user.username || user.globalName || 'Unknown');
                } catch {
                    sellerUsernames.set(trade.offerer_id, 'Unknown');
                }
            }
        } catch {
            trades.forEach(trade => sellerUsernames.set(trade.offerer_id, 'Unknown'));
        }

        const marketItems = trades.map(trade => ({
            id: trade.id,
            trade_id: trade.id,
            name: trade.name,
            description: trade.description,
            icon: trade.icon,
            price: trade.price,
            stock: trade.quantity,
            category: trade.is_usable ? 'Usable' : 'Non usable',
            seller_id: trade.offerer_id,
            seller_name: sellerUsernames.get(trade.offerer_id) || 'Unknown'
        }));

        const result = {
            items: marketItems,
            total: Number(totalCount?.count || 0),
            page,
            limit,
            totalPages: Math.ceil(Number(totalCount?.count || 0) / limit)
        };

        console.log('db.remote: getMarketListings returning page', page, 'of', result.totalPages);
        return result;
    } catch (error) {
        console.error('db.remote: getMarketListings error:', error);
        return { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
});

export const buyMarketItem = query(buyMarketParams, async (params) => {
    const { userId, itemId: tradeId, quantity } = params;

    if (quantity <= 0) {
        throw new Error('Quantity must be positive');
    }

    try {
        return await db.transaction().execute(async (trx) => {
            const trade = await trx
                .selectFrom('trades')
                .selectAll()
                .where('id', '=', tradeId)
                .executeTakeFirst();

            if (!trade) {
                throw new Error('Trade not found');
            }

            if (trade.quantity < quantity) {
                throw new Error('Not enough stock available');
            }

            if (trade.offerer_id === userId) {
                throw new Error('You cannot buy your own trade');
            }

            const totalCost = trade.price * quantity;

            const buyer = await trx
                .selectFrom('users')
                .selectAll()
                .where('id', '=', userId)
                .executeTakeFirst();

            if (!buyer) {
                throw new Error('Buyer not found');
            }

            const buyerCoins = BigInt(buyer.coins);
            if (buyerCoins < BigInt(totalCost)) {
                throw new Error('Not enough coins');
            }

            const seller = await trx
                .selectFrom('users')
                .selectAll()
                .where('id', '=', trade.offerer_id)
                .executeTakeFirst();

            if (!seller) {
                throw new Error('Seller not found');
            }

            await trx
                .updateTable('users')
                .set({ coins: (buyerCoins - BigInt(totalCost)).toString() })
                .where('id', '=', userId)
                .execute();

            await trx
                .updateTable('users')
                .set({ coins: (BigInt(seller.coins) + BigInt(totalCost)).toString() })
                .where('id', '=', trade.offerer_id)
                .execute();

            const newQuantity = trade.quantity - quantity;
            if (newQuantity <= 0) {
                await trx
                    .deleteFrom('trades')
                    .where('id', '=', tradeId)
                    .execute();
            } else {
                await trx
                    .updateTable('trades')
                    .set({ quantity: newQuantity })
                    .where('id', '=', tradeId)
                    .execute();
            }

            await trx
                .insertInto('inventory')
                .values({
                    id: userId,
                    item_id: trade.item_id,
                    quantity: quantity
                })
                .onConflict((oc) => oc
                    .columns(['id', 'item_id'])
                    .doUpdateSet((eb) => ({
                        quantity: eb('inventory.quantity', '+', quantity)
                    }))
                )
                .execute();

            const item = await trx
                .selectFrom('items')
                .select('name')
                .where('id', '=', trade.item_id)
                .executeTakeFirst();

            const itemName = item?.name || `Item #${trade.item_id}`;

            return { success: true, message: `Bought ${quantity}x ${itemName} for ${totalCost} coins` };
        });
    } catch (error) {
        throw error;
    }
});
