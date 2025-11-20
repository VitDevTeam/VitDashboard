import { query } from '$app/server';
import { startBot } from "$lib/bot";
import sql from "$lib/db";

const bot = await startBot();
const TEST_ID = "955695820999639120"
export const getUserStat = query(async (id = TEST_ID) => {
    let data = await sql`SELECT * FROM users WHERE id = ${id}`;
    return JSON.parse(JSON.stringify(data[0]));

    /*  coins, energy, energy_max, mood, mood_max */
});

export const getUserDiscord = query(async (id = TEST_ID) => {
    
    let discord_info = await bot.users.fetch(id);

    /* read doc discordjs */
    return JSON.parse(JSON.stringify(discord_info));
});


export const getInventory = query(async (id = TEST_ID) => {
    
    let inv = await sql`SELECT * FROM inventory WHERE id = ${id}`;


   
    return JSON.parse(JSON.stringify(inv));
    /* id (user id) , item_id, quantitity */  

    // this also contains item with quantity 0 (im dumb ok)


});


export const getItems = query(async () => {
    
    let inv = await sql`SELECT * FROM items WHERE id = ${id}`;

    return JSON.parse(JSON.stringify(inv[0]));
    /* id , name, description, icon */
});


