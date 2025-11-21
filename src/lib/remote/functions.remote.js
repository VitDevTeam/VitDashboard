import { query } from '$app/server';
import { startBot } from "$lib/bot";
import sql from "$lib/db";

const bot = await startBot();
const TEST_ID = "955695820999639120"

// Mock data for when database is not available
const mockUserStat = {
    id: TEST_ID,
    coins: "100000",
    energy: "54",
    energy_max: "100",
    mood: "100",
    mood_max: "100"
};

export const getUserStat = query(async (id = TEST_ID) => {
    try {
        let data = await sql`SELECT * FROM users WHERE id = ${id}`;
        return JSON.parse(JSON.stringify(data[0] || mockUserStat));
    } catch (error) {
        console.warn('Database error, using mock data:', error.message);
        return [mockUserStat];
    }
    /*  coins, energy, energy_max, mood, mood_max */
});

export const getUserDiscord = query(async (id = TEST_ID) => {
    try {
        let discord_info = await bot.users.fetch(id);
        /* read doc discordjs */
        return [JSON.parse(JSON.stringify(discord_info))];
    } catch (error) {
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


export const getInventory = query(async (id = TEST_ID) => {
    try {
        let inv = await sql`SELECT * FROM inventory WHERE id = ${id}`;
        return JSON.parse(JSON.stringify(inv));
    } catch (error) {
        console.warn('Database error, using mock inventory data:', error.message);
        // Mock inventory data based on your real data structure
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
        ];
    }
    /* id (user id) , item_id, quantitity */  
    // this also contains item with quantity 0 (im dumb ok)
});


export const getItems = query(async (id = TEST_ID) => {
    try {
        let inv = await sql`SELECT * FROM items WHERE id = ${id}`;
        return JSON.parse(JSON.stringify(inv[0]));
    } catch (error) {
        console.warn('Database error, using mock items data:', error.message);
        return {
            id: 1,
            name: "Sample Item",
            description: "Mock item data",
            icon: "📦"
        };
    }
    /* id , name, description, icon */
});


