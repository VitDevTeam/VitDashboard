<script>
    import { getLocalCoinsLeaderboard } from '$lib/remote/db.remote';
    import { getDiscordUser } from '$lib/remote/discord.remote';
    import { onMount } from 'svelte';

    export let guildId;

    let enrichedLeaderboardPromise;

    async function loadLeaderboard() {
        try {
            const leaderboard = await getLocalCoinsLeaderboard({ id: guildId, top: 10 });

            const enrichedData = await Promise.all(
                leaderboard.map(async (entry) => {
                    const user = await getDiscordUser(entry.user_id);
                    return {
                        ...entry,
                        user,
                    };
                })
            );

            return enrichedData;
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            throw error;
        }
    }

    onMount(() => {
        enrichedLeaderboardPromise = loadLeaderboard();
    });
</script>

<div class="card mt-6">
    <div class="card-body">
        <h2 class="card-title">Leaderboard</h2>
        {#await enrichedLeaderboardPromise}
            <p>Loading leaderboard...</p>
        {:then enrichedLeaderboard}
            <div class="overflow-x-auto">
                <table class="table w-full">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Coins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each enrichedLeaderboard as entry}
                            <tr>
                                <th>{entry.pos}</th>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div class="avatar">
                                            <div class="mask mask-squircle w-12 h-12">
                                                <img src={entry.user?.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="Avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <div class="font-bold">{entry.user?.name || 'Unknown User'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{entry.coins}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:catch error}
            <p>Error loading leaderboard: {error.message}</p>
        {/await}
    </div>
</div>
