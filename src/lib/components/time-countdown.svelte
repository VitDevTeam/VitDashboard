<script>
    import { onMount } from 'svelte';

    let { endDate } = $props();

    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);
    let expired = $state(false);

    function tick() {
        const now = Date.now();
        const end = new Date(endDate).getTime();
        const diffSeconds = Math.floor((end - now) / 1000);

        if (diffSeconds <= 0) {
            expired = true;
            hours = 0;
            minutes = 0;
            seconds = 0;
            return;
        }

        hours = Math.floor(diffSeconds / 3600);
        minutes = Math.floor((diffSeconds % 3600) / 60);
        seconds = diffSeconds % 60;
    }

    onMount(() => {
        tick();
        const i = setInterval(tick, 1000);
        return () => clearInterval(i);
    });
</script>

{#if expired}
    <span class="badge badge-error">Expired</span>
{:else}
    <span class="countdown font-mono text-sm">
        <span style="--value:{hours};"></span>h
        <span style="--value:{minutes};"></span>m
        <span style="--value:{seconds};"></span>s
    </span>
{/if}

