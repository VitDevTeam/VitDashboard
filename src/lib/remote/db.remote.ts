import { query } from '$app/server';
import { db } from "$lib/db/index";
import type { UsersTable, InventoryTable, ItemsTable } from "$lib/db/types";
import { num, str } from "$lib/validation";
import { getSession } from "$lib/auth/session";

const mockUserStat: UsersTable = {
    id: "955695820999639120",
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
    if (!id) {
        const session = await getSession();
        id = session?.user?.id || "955695820999639120";
    }
    
    try {
        const user = await db
            .selectFrom('users')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
       
        return user || mockUserStat;
    } catch (error: any) {
        console.warn('Database error, using mock data:', error.message);
        return mockUserStat;
    }
});


export const getInventory = query(async (id?: string) => {
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
        
        return inventory;
    } catch (error: any) {
        console.warn('Database error, using mock inventory data:', error.message);
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
    try {
        const items = await db
            .selectFrom('items')
            .selectAll()
            .where('id', 'in', item_ids)
            .execute();
        
        const lookup = new Map(items.map(item => [item.id, item]));
        
        return (item_id: number) => {
            return lookup.get(item_id) || {
                id: item_id,
                name: `Item #${item_id}`,
                description: "Unknown item",
                icon: "📦",
                is_usable: false
            } as ItemsTable;
        };
    } catch (error: any) {
        console.warn('Database error, using mock items data:', error.message);
        return (item_id: number) => mockItems[item_id] || {
            id: item_id,
            name: `Item #${item_id}`,
            description: "Unknown item",
            icon: "📦",
            is_usable: false
        } as ItemsTable;
    }
});

export const getAllItems = query(async () => {
    try {
        const items = await db
            .selectFrom('items')
            .selectAll()
            .execute();
        
        const itemsDict: Record<number, ItemsTable> = {};
        for (const item of items) {
            itemsDict[item.id] = item;
        }
        
        return itemsDict;
    } catch (error: any) {
        console.warn('Database error, using mock items dictionary:', error.message);
        return mockItems;
    }
});

export const getInventoryWithItems = query(async (id?: string) => {
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
        
        return inventory;
    } catch (error: any) {
        console.warn('Database error:', error.message);
        return [];
    }
});

export const getUserEffects = query(async (id?: string) => {
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
        
        return effects.map(effect => {
            const appliedAt = new Date(effect.applied_at).getTime();
            const durationMs = effect.duration * 30000;
            const endDate = new Date(appliedAt + durationMs);
            
            return {
                ...effect,
                endDate: endDate.toISOString()
            };
        });
    } catch (error: any) {
        console.warn('Database error:', error.message);
        return [];
    }
});


export const getGuild = query(str, async (id: string) => {
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

        return {
            guild_id: info.id,
            coins: info.coins,
            rank
        };
    } catch (error: any) {
        console.warn('Database error:', error.message);
        return null;
    }
});



