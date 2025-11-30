<script>
    import Nav from "$lib/components/nav.svelte";
    
    let { data } = $props();
</script>

<Nav />

<div class="min-h-screen bg-gradient-to-br from-lavender-100 to-cyan-50 p-6" style="background: linear-gradient(135deg, #e6e6fa 0%, #e0ffff 100%);">
    <div class="container mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Your Guilds</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.servers as server}
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <div class="flex items-center gap-4 mb-4">
                        {#if server.iconURL}
                            <img 
                                src="{server.iconURL}" 
                                alt="{server.name}"
                                class="w-16 h-16 rounded-full"
                            />
                        {:else}
                            <div class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
                                hmmm
                            </div>
                        {/if}
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">{server.name}</h3>
                            <p class="text-sm text-gray-500">{server.memberCount} members</p>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mb-4">ID: {server.id}</p>
                    <a 
                        href="/guild/{server.id}/config" 
                        data-sveltekit-reload
                        class="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Manage Settings
                    </a>
                </div>
            {/each}
        </div>
        
        {#if data.servers.length === 0}
            <div class="text-center py-12">
                <p class="text-gray-600 text-lg">You're not in any guilds yet.</p>
            </div>
        {/if}
    </div>
</div>