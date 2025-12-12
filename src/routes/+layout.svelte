<script>
    import { navigating, page } from '$app/stores';
    import './layout.css';
    import Nav from '$lib/components/nav.svelte';
    import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
    import UserControls from '$lib/components/UserControls.svelte';

    let { children } = $props();
    let sidebarCollapsed = $state(false);
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Aldrich:wght@400&display=swap" rel="stylesheet">
</svelte:head>

{#if $navigating}
    <progress class="progress progress-primary w-full fixed top-0 left-0 z-50"></progress>
{/if}

<div class="min-h-screen bg-base-200">
    <header class="bg-base-100 border-b border-base-300 px-4 py-2">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button
                    class="btn btn-ghost btn-sm"
                    onclick={() => sidebarCollapsed = !sidebarCollapsed}
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <nav class="text-sm breadcrumbs">
                    <ul>
                        <li><a href="/" class="link link-hover">Home</a></li>
                        {#if $page.url.pathname.startsWith('/market')}
                            <li>Market</li>
                        {:else if $page.url.pathname.startsWith('/guild')}
                            <li>Guild</li>
                        {:else if $page.url.pathname.startsWith('/user')}
                            <li>User</li>
                        {/if}
                    </ul>
                </nav>
            </div>
            <div class="flex items-center gap-3">
                <ThemeSwitcher />
                <div class="divider divider-horizontal"></div>
                <UserControls />
            </div>
        </div>
    </header>

    <div class="flex">
        <Nav bind:collapsed={sidebarCollapsed} />
        <main class="flex-1" class:p-4={!sidebarCollapsed} class:p-6={sidebarCollapsed}>
            {@render children()}
        </main>
    </div>
</div>
