<script lang="ts">
    import { enhance } from '$app/forms';
    import { emojiToURL } from '$lib/frontend/utils';
    import Button from './Button.svelte';

    let { recipes, selectedItem, crafting = $bindable(), inventoryMap } = $props();

    let craftAmounts = $state({});

    function getInventoryCount(itemId) {
        return inventoryMap.get(itemId) || 0;
    }

    function canCraft(recipe, amount) {
        for (const req of recipe.requirements) {
            const inventoryCount = getInventoryCount(req.item_id);
            const needed = req.quantity * amount;
            if (inventoryCount < needed) {
                return false;
            }
        }
        return true;
    }

    function getMaxCraftable(recipe) {
        let maxAmount = Infinity;
        for (const req of recipe.requirements) {
            if (req.is_consumed) {
                const inventoryCount = getInventoryCount(req.item_id);
                const canCraft = Math.floor(inventoryCount / req.quantity);
                maxAmount = Math.min(maxAmount, canCraft);
            }
        }
        return maxAmount === Infinity ? 0 : maxAmount;
    }
</script>

<div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Recipes for {selectedItem.name}</h2>
    <div class="overflow-x-auto">
        <table class="table w-full">
            <thead>
                <tr>
                    <th>Recipe</th>
                    <th>Requirements</th>
                    <th>Results</th>
                    <th colspan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                {#each recipes as recipe (recipe.id)}
                    {@const maxCraftable = getMaxCraftable(recipe)}
                    {@const currentAmount = craftAmounts[recipe.id] || 1}
                    {@const inputMax = 100}
                    <tr>
                        <td>{recipe.name}</td>
                        <td>
                            <div class="space-y-2">
                                <div>
                                    <p class="font-semibold text-sm mb-1">Cost Items:</p>
                                    <ul>
                                        {#each recipe.requirements.filter(req => req.is_consumed) as req}
                                            {@const haveCount = getInventoryCount(req.item_id)}
                                            {@const needCount = req.quantity * currentAmount}
                                            <li class="{haveCount < needCount ? 'text-error' : ''}">
                                                {#if req.icon && emojiToURL(req.icon)}
                                                    <img src={emojiToURL(req.icon)} alt={req.name} class="w-4 h-4 inline mr-1" />
                                                {:else}
                                                    <span class="w-4 h-4 bg-base-300 rounded inline-flex items-center justify-center text-xs mr-1">#{req.item_id}</span>
                                                {/if}
                                                {req.name}: {haveCount}/{needCount}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                                {#each recipe.requirements.filter(req => !req.is_consumed) as req}
                                    {@const haveCount = getInventoryCount(req.item_id)}
                                    {@const needCount = req.quantity * currentAmount}
                                    <div>
                                        <p class="font-semibold text-sm mb-1">Requirements:</p>
                                        <ul>
                                            <li class="{haveCount < needCount ? 'text-error' : ''}">
                                                {#if req.icon && emojiToURL(req.icon)}
                                                    <img src={emojiToURL(req.icon)} alt={req.name} class="w-4 h-4 inline mr-1" />
                                                {:else}
                                                    <span class="w-4 h-4 bg-base-300 rounded inline-flex items-center justify-center text-xs mr-1">#{req.item_id}</span>
                                                {/if}
                                                {req.name}: {haveCount}/{needCount} (reusable)
                                            </li>
                                        </ul>
                                    </div>
                                {/each}
                            </div>
                        </td>
                        <td>
                            <ul>
                                {#each recipe.results as res}
                                    <li>
                                        {res.quantity * currentAmount}x 
                                        {#if res.icon && emojiToURL(res.icon)}
                                            <img src={emojiToURL(res.icon)} alt={res.name} class="w-4 h-4 inline mr-1" />
                                        {:else}
                                            <span class="w-4 h-4 bg-base-300 rounded inline-flex items-center justify-center text-xs mr-1">#{res.item_id}</span>
                                        {/if}
                                        {res.name}
                                    </li>
                                {/each}
                            </ul>
                        </td>
                        <td colspan="2">
                            <form
                                method="POST"
                                action="?/craft"
                                class="flex items-center gap-2"
                                use:enhance={() => {
                                    crafting = true;
                                    return async ({ update }) => {
                                        await update();
                                        crafting = false;
                                    };
                                }}
                            >
                                <input type="hidden" name="recipeId" value={recipe.id} />
                                <input 
                                    type="number" 
                                    name="amount" 
                                    min="1" 
                                    max={inputMax}
                                    bind:value={craftAmounts[recipe.id]}
                                    class="input input-bordered w-24" 
                                />
                                <Button 
                                    type="submit" 
                                    class="btn-primary" 
                                    disabled={crafting || !canCraft(recipe, currentAmount)}
                                >
                                    {crafting ? 'Crafting...' : `Craft (${maxCraftable} max)`}
                                </Button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
