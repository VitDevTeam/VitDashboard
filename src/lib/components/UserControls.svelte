<script>
    import { signOut, useSession } from "$lib/auth-client";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    let sessionData = $state(null);
    let isLoading = $state(true);

    onMount(() => {
        if (browser) {
            setTimeout(() => {
                const sessionStore = useSession();
                const unsubscribe = sessionStore.subscribe((value) => {
                    sessionData = value;
                    isLoading = false;
                });
                return unsubscribe;
            }, 100);
        } else {
            isLoading = false;
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

{#if sessionData?.data?.user}
    <div class="flex items-center gap-2">
        <span class="text-sm">
            {sessionData.data.user.name || sessionData.data.user.email}
        </span>
        <button onclick={handleSignOut} class="btn btn-ghost btn-sm">
            Sign Out
        </button>
    </div>
{:else}
    <a href="/login" class="btn btn-primary btn-sm">
        Sign In
    </a>
{/if}
