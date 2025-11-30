<script>
    import Nav from "$lib/components/nav.svelte";
    import { onMount } from "svelte";
    
    let { data, form } = $props();
    
    onMount(() => {
        console.log("Config page mounted with data:", data);
    });
</script>

<Nav />

{#if data}
    <div class="min-h-screen bg-gradient-to-br from-lavender-100 to-cyan-50 p-6" style="background: linear-gradient(135deg, #e6e6fa 0%, #e0ffff 100%);">
        <div class="container mx-auto">
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Guild Settings</h1>
                {#if data.guild}
                    <div class="flex items-center gap-3 mt-2">
                        {#if data.guild.iconURL}
                            <img src={data.guild.iconURL} alt={data.guild.name} class="w-12 h-12 rounded-full" />
                        {/if}
                        <p class="text-xl text-gray-600">{data.guild.name}</p>
                    </div>
                {/if}
            </div>

        {#if form?.success}
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Settings saved successfully!
            </div>
        {/if}

        <form method="POST" class="bg-white rounded-lg border border-gray-300 p-6">
        <fieldset>
            <legend class="text-xl font-bold mb-4">Bot Configuration</legend>
            
            <div class="mb-6">
                <label for="prefix" class="block font-bold mb-2">Command Prefix</label>
                <p class="text-gray-600 text-sm mb-2">
                    The character(s) used to trigger bot commands (e.g., if prefix is "!" then use !ping)
                </p>
                <input 
                    type="text" 
                    maxlength="5" 
                    id="prefix" 
                    name="prefix" 
                    value={data.config.prefix} 
                    required
                    class="border border-gray-300 rounded px-3 py-2 w-32"
                />
            </div>

            <div class="mb-6">
                <fieldset>
                    <legend class="block font-bold mb-2">Allow Robbing</legend>
                    <p class="text-gray-600 text-sm mb-2">
                        Enable or disable the rob command in your server
                    </p>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2">
                            <input 
                                type="radio" 
                                name="allow_rob" 
                                value="true" 
                                checked={data.config.allow_rob}
                            /> 
                            <span>Yes</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input 
                                type="radio" 
                                name="allow_rob" 
                                value="false" 
                                checked={!data.config.allow_rob}
                            /> 
                            <span>No</span>
                        </label>
                    </div>
                </fieldset>
            </div>

                <button 
                    type="submit"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
                >
                    Save Settings
                    </button>
                </fieldset>
            </form>
        </div>
    </div>
{:else}
    <div class="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
    </div>
{/if}
