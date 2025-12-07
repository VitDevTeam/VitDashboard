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

<aside class="w-64 bg-base-100 shadow-md flex flex-col">
    <div class="p-4">
        <a href="/" class="btn btn-ghost text-xl font-bold w-full">
            VIT Dashboard
        </a>
    </div>
    <ul class="menu p-4 flex-1">
        <li><a href="/user/me" data-sveltekit-reload>Profile</a></li>
        <li><a href="/guild">Guilds</a></li>
    </ul>
    <div class="p-4 border-t border-base-300">
        <div class="flex flex-col items-center gap-4">
            {#if sessionData?.data?.user}
                <div class="text-center mb-2">
                    <span class="font-semibold">
                        {sessionData.data.user.name || sessionData.data.user.email}
                    </span>
                </div>
                <button
                    onclick={handleSignOut}
                    class="btn btn-error w-full"
                >
                    Sign Out
                </button>
            {:else}
                <a
                    href="/login"
                    class="btn btn-primary w-full"
                >
                    Sign In
                </a>
            {/if}
        </div>
    </div>
</aside>
