<script>
    import { signOut, useSession } from "$lib/auth-client";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    
    let sessionData = $state(null);
    
    onMount(() => {
        if (browser) {
            const sessionStore = useSession();
            
            // Subscribe to the store
            const unsubscribe = sessionStore.subscribe((value) => {
                sessionData = value;
            });
            
            return unsubscribe;
        }
    });
    
    async function handleSignOut() {
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        sessionData = null;
                        goto("/login");
                    }
                }
            });
        } catch (error) {
            console.error("Sign out error:", error);
            sessionData = null;
            goto("/login");
        }
    }
</script>

<nav class="bg-white shadow-md">
    <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
            <a href="/" class="text-2xl font-bold text-gray-800">
                VIT Dashboard
            </a>
            
            <div class="flex items-center gap-4">
                {#if sessionData?.data?.user}
                    <span class="text-gray-600">
                        {sessionData.data.user.name || sessionData.data.user.email}
                    </span>
                    <a href="/user/me" class="text-gray-600 hover:text-gray-800">
                        Profile
                    </a>
                    <button
                        onclick={handleSignOut}
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                        Sign Out
                    </button>
                {:else}
                    <a
                        href="/login"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                        Sign In
                    </a>
                {/if}
            </div>
        </div>
    </div>
</nav>
