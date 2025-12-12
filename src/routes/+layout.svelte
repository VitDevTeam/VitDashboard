<script>
    import { navigating } from '$app/stores';
    import './layout.css';
    import Nav from '$lib/components/nav.svelte';
    import { themeChange } from 'theme-change';
    import { onMount } from "svelte";

    let { children } = $props();

    onMount(() => themeChange());
</script>
<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Aldrich:wght@400&display=swap" rel="stylesheet">
</svelte:head>

{#if $navigating}
    <progress class="progress progress-primary w-full fixed top-0 left-0 z-50"></progress>
{/if}
<div class="flex min-h-screen">
    <Nav />
    <main class="flex-1 p-6 bg-base-200">
        {@render children()}
    </main>
</div>
