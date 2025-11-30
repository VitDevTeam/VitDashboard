<script>
    import { page } from '$app/stores';
    import Nav from "$lib/components/nav.svelte";
</script>

<Nav />

<div class="min-h-screen bg-gradient-to-br from-lavender-100 to-cyan-50 flex items-center justify-center p-6" style="background: linear-gradient(135deg, #e6e6fa 0%, #e0ffff 100%);">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div class="text-6xl mb-4">bhai</div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">
            {$page.status === 403 ? 'Access Denied' : 'Error'}
        </h1>
        <p class="text-gray-600 mb-6">
            {$page.error?.message || 'An error occurred'}
        </p>
        <div class="flex gap-4 justify-center">
            <a 
                href="/guild" 
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition duration-200"
            >
                Back to Guilds
            </a>
            <a 
                href="/" 
                class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition duration-200"
            >
                Home
            </a>
        </div>
    </div>
</div>
