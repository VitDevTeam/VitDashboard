<script>
    import { navigating } from '$app/stores';
    
    let { children } = $props();
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Aldrich:wght@400&display=swap" rel="stylesheet">
</svelte:head>

{#if $navigating}
    <progress class="progress progress-primary w-full fixed top-0 left-0 z-50"></progress>
{/if}
<main class="flex-1 p-6 bg-base-200">
    {@render children()}
</main>
