<script>
    import Nav from "$lib/components/nav.svelte";
    
    let { data } = $props();
</script>

<div class="min-h-screen bg-base-200 p-6">
    <div class="container mx-auto">
        <h1 class="text-3xl font-bold mb-6">Your Guilds</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.servers as server}
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="avatar">
                                <div class="w-16 rounded-full">
                                    {#if server.iconURL}
                                        <img src="{server.iconURL}" alt="{server.name}" />
                                    {:else}
                                        <div class="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center text-2xl">
                                            🤔
                                        </div>
                                    {/if}
                                </div>
                            </div>
                            <div>
                                <h2 class="card-title">{server.name}</h2>
                                <p>{server.memberCount} members</p>
                            </div>
                        </div>
                        <p class="text-xs text-base-content/50 mb-4">ID: {server.id}</p>
                        <div class="card-actions justify-end">
                            <a href="/guild/{server.id}" data-sveltekit-reload class="btn btn-primary">
                                Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        
        {#if data.servers.length === 0}
            <div class="text-center py-12">
                <p class="text-lg">You're not in any guilds yet.</p>
            </div>
        {/if}
    </div>
</div>