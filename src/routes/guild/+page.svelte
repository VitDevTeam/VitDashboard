<script>
    import { getUserGuilds } from "$lib/remote/discord.remote";

    const servers = await getUserGuilds();
    
</script>

{#each servers as server}
    <div>
        <img src="{server.iconURL}" alt="{server.name}">
        <h3>{server.name}</h3>
        <h3>{server.id}</h3>
        <a href="/guild/{server.id}"> Click to redirect </a>
    </div>
{/each}