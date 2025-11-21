import { query } from '$app/server';
import { startBot } from "$lib/bot";
import { db } from "$lib/db/index";
import type { UsersTable, InventoryTable, ItemsTable } from "$lib/db/types";
import { num, str } from "$lib/validation";

const bot = await startBot();
const TEST_ID = "1186872689038729237";


const mockUserStat: UsersTable = {
    id: TEST_ID,
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

// Get user stats (coins, energy, energy_max, mood, mood_max)
export const getUserStat = query(async (id: string = TEST_ID) => {
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

// Get Discord user info
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

// Get user inventory (id, item_id, quantity)
export const getInventory = query(async (id: string = TEST_ID) => {
    try {
        const inventory = await db
            .selectFrom('inventory')
            .selectAll()
            .where('id', '=', id)
            .execute();
        
        return inventory;
    } catch (error: any) {
        console.warn('Database error, using mock inventory data:', error.message);
        // Mock inventory data
        return [
            {id: TEST_ID, item_id: 1, quantity: 110},
            {id: TEST_ID, item_id: 2, quantity: 0},
            {id: TEST_ID, item_id: 3, quantity: 0},
            {id: TEST_ID, item_id: 4, quantity: 52},
            {id: TEST_ID, item_id: 5, quantity: 0},
            {id: TEST_ID, item_id: 6, quantity: 0},
            {id: TEST_ID, item_id: 7, quantity: 0},
            {id: TEST_ID, item_id: 8, quantity: 444},
            {id: TEST_ID, item_id: 9, quantity: 0},
            {id: TEST_ID, item_id: 10, quantity: 0},
            {id: TEST_ID, item_id: 11, quantity: 0},
            {id: TEST_ID, item_id: 12, quantity: 0},
            {id: TEST_ID, item_id: 13, quantity: 0},
            {id: TEST_ID, item_id: 14, quantity: 5},
            {id: TEST_ID, item_id: 15, quantity: 0},
            {id: TEST_ID, item_id: 16, quantity: 0},
            {id: TEST_ID, item_id: 17, quantity: 0},
            {id: TEST_ID, item_id: 18, quantity: 0},
            {id: TEST_ID, item_id: 26, quantity: 0}
        ] as InventoryTable[];
    }
});

// Get single item by ID (id, name, description, icon, is_usable)
export const getItem = query(num, async (item_id: number) => {
    try {
        const item = await db
            .selectFrom('items')
            .selectAll()
            .where('id', '=', item_id)
            .executeTakeFirst();
        
        if (item) {
            return item;
        }
        
        // If no item found, return default
        return {
            id: item_id,
            name: `Item #${item_id}`,
            description: "Unknown item",
            icon: "📦",
            is_usable: false
        } as ItemsTable;
    } catch (error: any) {
        console.warn('Database error, using mock items data:', error.message);
        
        return mockItems[item_id] || {
            id: item_id,
            name: `Item #${item_id}`,
            description: "Unknown item",
            icon: "📦",
            is_usable: false
        } as ItemsTable;
    }
});

// Get all items as a dictionary
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
