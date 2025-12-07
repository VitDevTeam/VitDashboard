<script>
    import { emojiToURL } from "$lib/frontend/utils";
    import TimeCountdown from "$lib/components/time-countdown.svelte";
    import InventoryTable from "$lib/components/InventoryTable.svelte";
    let { data } = $props();
    
    const userStats = data.userStats;
    const discordUser = data.discordUser;
    const inventory = data.inventory;
    const effects = data.effects;

    // Calculate inventory summary
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItems = inventory.filter(item => item.quantity > 0).length;
    
    // Energy percentage for progress bar
    const energyPercentage = (userStats.energy / userStats.energy_max) * 100;
    const moodPercentage = (userStats.mood / userStats.mood_max) * 100;
</script>


<svelte:head>
    <title>VIT Dashboard - User Stats</title>
</svelte:head>

<style>
    .aldrich {
        font-family: 'Aldrich', monospace;
    }
</style>

<div class="container mx-auto aldrich">
        <!-- Header -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold mb-2">Welcome, {discordUser.globalName || discordUser.username}</h1>
            <p>This is your current report</p>
        </div>

        <!-- Main Stats Grid -->
        <div class="stats stats-vertical lg:stats-horizontal shadow mb-8 self-center">
            <div class="stat">
                <div class="stat-title">Energy</div>
                <div class="stat-value">{userStats.energy} / {userStats.energy_max}</div>
                <div class="stat-desc">{energyPercentage.toFixed(2)}%</div>
                <progress class="progress progress-warning w-full" value={energyPercentage} max="100"></progress>
            </div>
            
            <div class="stat">
                <div class="stat-title">Mood</div>
                <div class="stat-value">{userStats.mood} / {userStats.mood_max}</div>
                <div class="stat-desc">{moodPercentage.toFixed(2)}%</div>
                <progress class="progress progress-info w-full" value={moodPercentage} max="100"></progress>
            </div>
            
            <div class="stat">
                <div class="stat-title">Inventory Load</div>
                <div class="stat-value">{uniqueItems}</div>
                <div class="stat-desc">Total items: {totalItems}</div>
            </div>
        </div>

        <!-- Effects and Inventory Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title justify-center">EFFECTS</h2>
                    <div class="space-y-4">
                        {#if effects.length === 0}
                            <p class="text-center text-base-content/70">No active effects</p>
                        {:else}
                            {#each effects as effect}
                                <div class="flex items-center space-x-3 p-3 bg-base-200 rounded-box">
                                    <div class="avatar">
                                        <div class="w-8 rounded-full">
                                            {#if effect.icon && emojiToURL(effect.icon)}
                                                <img src={emojiToURL(effect.icon)} alt={effect.name} />
                                            {:else}
                                                <span>scammer test</span>
                                            {/if}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-bold">{effect.name}</div>
                                        <div class="text-sm opacity-70">{effect.description}</div>
                                        <div class="text-xs opacity-50">
                                            <TimeCountdown endDate={effect.endDate} />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Actions Section -->
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title justify-center">ACTIONS</h2>
                    <div class="space-y-4">
                        <a href="/user/me/actions/craft" class="block p-3 bg-base-200 rounded-box hover:bg-base-300 transition-colors">
                            <div class="flex items-center space-x-3">
                                
                                <div>
                                    <div class="font-bold">Crafting</div>
                                    <div class="text-sm opacity-70">Create items from materials</div>
                                </div>
                            </div>
                        </a>

                        <div class="flex items-center space-x-3 p-3 bg-base-200 rounded-box opacity-50">
                            
                            <div>
                                <div class="font-bold">other stuff</div>
                                <div class="text-sm opacity-70">Coming soon...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Inventory Table -->
        <div class="mt-8 card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Complete Inventory</h2>
                <InventoryTable inventory={inventory} />
            </div>
        </div>
</div>

<!-- [{"id":"955695820999639120","coins":"100000","energy":"54","energy_max":"100","mood_max":"100","mood":"100"},{"id":"955695820999639120","bot":false,"system":false,"flags":4194368,"username":"youngcoder45","globalName":"Aditya ✧ YC45","discriminator":"0","avatar":"cf296ec1b2af5b10746bb89dbd24fc38","avatarDecoration":null,"avatarDecorationData":{"asset":"a_d3da36040163ee0f9176dfe7ced45cdc","skuId":"1144058522808614923"},"collectibles":null,"primaryGuild":{"identityGuildId":"1263067254153805905","identityEnabled":true,"tag":"CODE","badge":"04cee49fbcaa69a71206ccb637470e72"},"createdTimestamp":1647926039696,"defaultAvatarURL":"https://cdn.discordapp.com/embed/avatars/2.png","tag":"youngcoder45","avatarURL":"https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp","displayAvatarURL":"https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp","guildTagBadgeURL":"https://cdn.discordapp.com/guild-tag-badges/1263067254153805905/04cee49fbcaa69a71206ccb637470e72.webp"},[{"id":"955695820999639120","item_id":1,"quantity":110},{"id":"955695820999639120","item_id":2,"quantity":0},{"id":"955695820999639120","item_id":3,"quantity":0},{"id":"955695820999639120","item_id":4,"quantity":52},{"id":"955695820999639120","item_id":5,"quantity":0},{"id":"955695820999639120","item_id":6,"quantity":0},{"id":"955695820999639120","item_id":7,"quantity":0},{"id":"955695820999639120","item_id":8,"quantity":444},{"id":"955695820999639120","item_id":9,"quantity":0},{"id":"955695820999639120","item_id":10,"quantity":0},{"id":"955695820999639120","item_id":11,"quantity":0},{"id":"955695820999639120","item_id":12,"quantity":0},{"id":"955695820999639120","item_id":13,"quantity":0},{"id":"955695820999639120","item_id":14,"quantity":5},{"id":"955695820999639120","item_id":15,"quantity":0},{"id":"955695820999639120","item_id":16,"quantity":0},{"id":"955695820999639120","item_id":17,"quantity":0},{"id":"955695820999639120","item_id":18,"quantity":0},{"id":"955695820999639120","item_id":26,"quantity":0}]] -->




