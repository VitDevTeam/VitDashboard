<script>
    import { onMount } from "svelte";
    
    let { data, form } = $props();
    
    onMount(() => {
        console.log("Config page mounted with data:", data);
    });
</script>

{#if data}
    <div class="min-h-screen bg-base-200 p-6">
        <div class="container mx-auto">
            <div class="mb-6">
                <h1 class="text-3xl font-bold">Guild Settings</h1>
                {#if data.guild}
                    <div class="flex items-center gap-3 mt-2">
                        <div class="avatar">
                            <div class="w-12 rounded-full">
                                {#if data.guild.iconURL}
                                    <img src={data.guild.iconURL} alt={data.guild.name} />
                                {/if}
                            </div>
                        </div>
                        <p class="text-xl">{data.guild.name}</p>
                    </div>
                {/if}
            </div>

            {#if form?.success}
                <div class="alert alert-success shadow-lg mb-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Settings saved successfully!</span>
                    </div>
                </div>
            {/if}

            <form method="POST" class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Bot Configuration</h2>
                    
                    <div class="form-control w-full max-w-xs">
                        <label class="label" for="prefix">
                            <span class="label-text">Command Prefix</span>
                        </label>
                        <input 
                            type="text" 
                            maxlength="5" 
                            id="prefix" 
                            name="prefix" 
                            value={data.config.prefix} 
                            required
                            class="input input-bordered w-full max-w-xs"
                        />
                        <label class="label" for="prefix">
                            <span class="label-text-alt">The character(s) used to trigger bot commands (e.g., if prefix is "!" then use !ping)</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label cursor-pointer" for="allow_rob">
                            <span class="label-text">Allow Robbing</span> 
                            <input 
                                type="checkbox" 
                                name="allow_rob" 
                                id="allow_rob"
                                class="toggle" 
                                checked={data.config.allow_rob} 
                            />
                        </label>
                        <label class="label" for="allow_rob">
                            <span class="label-text-alt">Enable or disable the rob command in your server</span>
                        </label>
                    </div>

                    <div class="card-actions justify-end">
                        <button type="submit" class="btn btn-primary">
                            Save Settings
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
{:else}
    <div class="min-h-screen flex items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
{/if}
