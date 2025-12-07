<script>
    /** @type {import('./$types').PageProps} */
    let { data } = $props();
    let { info } = data;

    import { getDiscordGuild, getDiscordUser } from '$lib/remote/discord.remote';
    let dc_info = await getDiscordGuild(info.guild_id);
    let owner = await getDiscordUser(dc_info.ownerId);
</script>

<div class="space-y-6 max-w-2xl mx-auto">
    
    <div class="card card-compact bg-base-100 shadow-xl">
        <div class="card-body p-6">
            <div class="flex items-center space-x-4">
                <div class="avatar">
                    <div class="w-16 rounded-lg">
                        <img src={dc_info.iconURL} alt="Guild Icon" />
                    </div>
                </div>
                <div>
                    <h2 class="card-title">{dc_info.name}</h2>
                    <p class="text-sm text-base-content/70">{dc_info.description || 'No description'}</p>
                </div>
            </div>

            <div class="flex justify-between items-center text-sm mt-4 pt-4 border-t border-base-200">
                <p>
                    <span class="font-bold text-lg">{dc_info.memberCount}</span> Members
                </p>
                <p>
                    Owned by: <span class="font-semibold">{owner?.name || 'Unknown'}</span>
                </p>
            </div>
        </div>
    </div>
    
    <div class="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-200">
        <div class="stat">
            <div class="stat-title">Coins</div>
            <div class="stat-value text-primary">{info.coins.toLocaleString()}</div>
        </div>
        <div class="stat">
            <div class="stat-title">Global Rank</div>
            <div class="stat-value text-secondary">#{info.rank}</div>
        </div>
    </div>

    <div class="card card-compact bg-base-100 shadow-xl border border-base-300">
        <div class="card-body p-6 flex-row justify-between items-center">
            <h3 class="card-title">Administration</h3>
            <div class="card-actions">
                <a href="/guild/{info.guild_id}/config">
                    <button class="btn btn-sm btn-primary btn-outline">
                        Manage Settings
                    </button>
                </a>
            </div>
        </div>
    </div>
</div>