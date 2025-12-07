<script lang="ts">
    import { page } from '$app/stores';

    const errorMessage = $page.url.searchParams.get('message') || 'An unexpected error occurred.';
</script>

<div class="flex items-center justify-center h-screen">
    <div class="text-center">
        <h1 class="text-4xl font-bold text-red-500">Authentication Error</h1>
        <p class="mt-4 text-lg">{errorMessage}</p>
        <p class="mt-2 text-gray-600">We are currently experiencing high traffic. Please try again in a few moments.</p>
        <a href="/" class="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Go to Homepage</a>
    </div>
</div>
