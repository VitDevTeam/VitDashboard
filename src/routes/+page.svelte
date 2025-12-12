<script>
    import Nav from "$lib/components/nav.svelte";

    let { data } = $props();
</script>

<div class="min-h-screen bg-base-200 p-6">
    <div class="container mx-auto">
        {#if data.dbStatus === 'offline'}
            <div class="alert alert-warning mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 17.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Database temporarily unavailable. Some features may not work.</span>
            </div>
        {/if}

        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold mb-4">Welcome to VIT Dashboard</h1>
            <p class="text-xl">Manage your virtual items and track your progress</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a href="/user/me" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
                <div class="card-body items-center text-center">
                    <div class="text-4xl mb-4"></div>
                    <h2 class="card-title">Profile</h2>
                    <p>View your stats, inventory, and effects</p>
                </div>
            </a>
            
            <a href="/guild" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
                <div class="card-body items-center text-center">
                    <div class="text-4xl mb-4"></div>
                    <h2 class="card-title">Guilds</h2>
                    <p>Manage your guild settings and view rankings</p>
                </div>
            </a>
            
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body items-center text-center">
                    <div class="text-4xl mb-4"></div>
                    <h2 class="card-title">Stats</h2>
                    <p>Track your progress and achievements</p>
                </div>
            </div>
        </div>
    </div>
</div>
