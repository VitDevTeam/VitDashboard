<script>
    import Nav from "$lib/components/nav.svelte";
    
    let { data } = $props();
</script>

<Nav />

<div class="min-h-screen bg-gradient-to-br from-lavender-100 to-cyan-50" style="background: linear-gradient(135deg, #e6e6fa 0%, #e0ffff 100%);">
    <div class="container mx-auto px-6 py-12">
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-gray-800 mb-4">Welcome to VIT Dashboard</h1>
            <p class="text-xl text-gray-600">Manage your virtual items and track your progress</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a href="/user/me" class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200">
                <div class="text-4xl mb-4">👤</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Profile</h2>
                <p class="text-gray-600">View your stats, inventory, and effects</p>
            </a>
            
            <a href="/guild" class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200">
                <div class="text-4xl mb-4">🏰</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Guilds</h2>
                <p class="text-gray-600">Manage your guild settings and view rankings</p>
            </a>
            
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <div class="text-4xl mb-4">📊</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Stats</h2>
                <p class="text-gray-600">Track your progress and achievements</p>
            </div>
        </div>
    </div>
</div>