<script>
    import { getUserStat, getUserDiscord, getInventory, getItem} from "$lib/remote/functions.remote";
    import { emojiToURL } from "$lib/frontend/utils";
    
    // Get basic data
    let dbStats = await getUserStat();
    let userDiscord = await getUserDiscord();
    let userInventory = await getInventory();
    
    // Add item info to each inventory item (simple loop)

    try {
        for (let i = 0; i < userInventory.length; i++) {
        let item_info = await getItem(userInventory[i].item_id);
        userInventory[i].name = item_info.name;
        userInventory[i].description = item_info.description;
        userInventory[i].icon = item_info.icon;
    }
    } catch (error) {
        console.error(error)
    }
    
    
    // Parse the data
    const userStats = dbStats;
    const discordUser = userDiscord[0];
    const inventory = userInventory;

    // Calculate inventory summary
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItems = inventory.filter(item => item.quantity > 0).length;
    
    // Energy percentage for progress bar
    const energyPercentage = (userStats.energy / userStats.energy_max) * 100;
    const moodPercentage = (userStats.mood / userStats.mood_max) * 100;
</script>

<svelte:head>
    <title>VIT Dashboard - User Stats</title>
    <link href="https://fonts.googleapis.com/css2?family=Aldrich:wght@400&display=swap" rel="stylesheet">
</svelte:head>

<style>
    .aldrich {
        font-family: 'Aldrich', monospace;
    }
</style>

<div class="min-h-screen bg-linear-to-br from-lavender-100 to-cyan-50 aldrich" style="background: linear-gradient(135deg, #e6e6fa 0%, #e0ffff 100%);">
    <div class="container mx-auto p-6">
        <!-- Header -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome, {discordUser.globalName || discordUser.username}</h1>
            <p class="text-gray-600">This is your current report</p>
        </div>

        <!-- Main Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Energy Card -->
            <div class="bg-white rounded-lg border border-gray-300 p-6">
                <h3 class="text-black font-bold mb-4">Energy</h3>
                <div class="text-3xl font-bold text-black mb-2">{userStats.energy} / {userStats.energy_max} ({energyPercentage}%)</div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                        class="bg-yellow-400 h-3 rounded-full" 
                        style="width: {energyPercentage}%"
                    ></div>
                </div>
            </div>

            <!-- Mood Card -->
            <div class="bg-white rounded-lg border border-gray-300 p-6">
                <h3 class="text-black font-bold mb-4">Mood</h3>
                <div class="text-3xl font-bold text-black mb-2">{userStats.mood} / {userStats.mood_max} ({moodPercentage}%)</div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                        class="bg-orange-400 h-3 rounded-full" 
                        style="width: {moodPercentage}%"
                    ></div>
                </div>
            </div>

            <!-- Inventory Load Card -->
            <div class="bg-white rounded-lg border border-gray-300 p-6">
                <h3 class="text-black font-bold mb-4">Inventory Load</h3>
                <div class="text-3xl font-bold text-black mb-2">{uniqueItems} items</div>
                <div class="text-lg text-black">Total: {totalItems}</div>
            </div>
        </div>

        <!-- Effects and Inventory Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Effects Section -->
            <div class="bg-white rounded-lg border border-gray-300 p-6">
                <h3 class="text-black font-bold mb-4 text-center bg-gray-100 py-2 rounded">EFFECTS</h3>
                <div class="space-y-4">
                    <!-- Well Rested Effect -->
                    <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm">✓</span>
                        </div>
                        <div>
                            <div class="text-black font-bold">Well Rested</div>
                            <div class="text-black text-sm">Energy regeneration +10%</div>
                            <div class="text-gray-500 text-sm">⏰ {Math.floor(Math.random() * 24)}h</div>
                        </div>
                    </div>

                    <!-- Focused Effect -->
                    <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                        <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm">⚡</span>
                        </div>
                        <div>
                            <div class="text-black font-bold">Focused</div>
                            <div class="text-black text-sm">Productivity +15%</div>
                            <div class="text-gray-500 text-sm">⏰ {Math.floor(Math.random() * 12)}h</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inventory Section -->
            <div class="bg-white rounded-lg border border-gray-300 p-6">
                <h3 class="text-black font-bold mb-4 text-center bg-gray-100 py-2 rounded">INVENTORY</h3>
                <div class="space-y-4">
                    {#each inventory.filter(item => item.quantity > 0).slice(0, 3) as item}
                        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                            {#if item.icon && emojiToURL(item.icon)}
                                <img src={emojiToURL(item.icon)} alt={item.name} class="w-8 h-8" />
                            {:else}
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm">{item.item_id}</span>
                                </div>
                            {/if}
                            <div class="flex-1">
                                <div class="text-black font-bold">
                                    {item.name || `Item #${item.item_id}`}
                                </div>
                                <div class="text-gray-500 text-sm">{item.description || `Item ID: ${item.item_id}`}</div>
                                <div class="text-black text-sm font-bold">Quantity: {item.quantity}</div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Detailed Inventory Table -->
        <div class="mt-8 bg-white rounded-lg border border-gray-300 overflow-hidden">
            <div class="bg-gray-100 p-4 border-b border-gray-300">
                <h3 class="text-black font-bold">Complete Inventory</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-black font-bold">Item</th>
                            <th class="px-6 py-3 text-left text-black font-bold">Quantity</th>
                            <th class="px-6 py-3 text-left text-black font-bold">Usable</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each inventory.filter(item => item.quantity > 0) as item}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        {#if item.icon && emojiToURL(item.icon)}
                                            <img src={emojiToURL(item.icon)} alt={item.name} class="w-8 h-8 mr-3" />
                                        {:else}
                                            <div class="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-3">
                                                <span class="text-white text-sm font-bold">{item.item_id}</span>
                                            </div>
                                        {/if}
                                        <div>
                                            <div class="text-black font-medium">
                                                {item.name || `Item #${item.item_id}`}
                                            </div>
                                            <div class="text-gray-500 text-xs">{item.description || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-black font-bold">{item.quantity}</span>
                                </td>
                                <td class="px-6 py-4">
                                    {#if item.item_id === 1 || item.item_id === 4 || item.item_id === 8}
                                        <span class="inline-flex px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-700">
                                            Usable
                                        </span>
                                    {:else}
                                        <span class="inline-flex px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-700">
                                            Not Usable
                                        </span>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- [{"id":"955695820999639120","coins":"100000","energy":"54","energy_max":"100","mood_max":"100","mood":"100"},{"id":"955695820999639120","bot":false,"system":false,"flags":4194368,"username":"youngcoder45","globalName":"Aditya ✧ YC45","discriminator":"0","avatar":"cf296ec1b2af5b10746bb89dbd24fc38","avatarDecoration":null,"avatarDecorationData":{"asset":"a_d3da36040163ee0f9176dfe7ced45cdc","skuId":"1144058522808614923"},"collectibles":null,"primaryGuild":{"identityGuildId":"1263067254153805905","identityEnabled":true,"tag":"CODE","badge":"04cee49fbcaa69a71206ccb637470e72"},"createdTimestamp":1647926039696,"defaultAvatarURL":"https://cdn.discordapp.com/embed/avatars/2.png","tag":"youngcoder45","avatarURL":"https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp","displayAvatarURL":"https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp","guildTagBadgeURL":"https://cdn.discordapp.com/guild-tag-badges/1263067254153805905/04cee49fbcaa69a71206ccb637470e72.webp"},[{"id":"955695820999639120","item_id":1,"quantity":110},{"id":"955695820999639120","item_id":2,"quantity":0},{"id":"955695820999639120","item_id":3,"quantity":0},{"id":"955695820999639120","item_id":4,"quantity":52},{"id":"955695820999639120","item_id":5,"quantity":0},{"id":"955695820999639120","item_id":6,"quantity":0},{"id":"955695820999639120","item_id":7,"quantity":0},{"id":"955695820999639120","item_id":8,"quantity":444},{"id":"955695820999639120","item_id":9,"quantity":0},{"id":"955695820999639120","item_id":10,"quantity":0},{"id":"955695820999639120","item_id":11,"quantity":0},{"id":"955695820999639120","item_id":12,"quantity":0},{"id":"955695820999639120","item_id":13,"quantity":0},{"id":"955695820999639120","item_id":14,"quantity":5},{"id":"955695820999639120","item_id":15,"quantity":0},{"id":"955695820999639120","item_id":16,"quantity":0},{"id":"955695820999639120","item_id":17,"quantity":0},{"id":"955695820999639120","item_id":18,"quantity":0},{"id":"955695820999639120","item_id":26,"quantity":0}]] -->




