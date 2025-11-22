<script>
    /** @type {import('./$types').PageProps} */
    let { data } = $props();
    let { info } = data;
</script>

Coins: {info.coins}
Global Rank: #{info.rank}
