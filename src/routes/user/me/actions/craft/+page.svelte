<script lang="ts">
    import { enhance } from '$app/forms';
    import { emojiToURL } from '$lib/frontend/utils';
    import RecipesTable from '$lib/components/RecipesTable.svelte';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData; form: ActionData } = $props();

    let selectedItemId = $state('');
    let loadingRecipes = $state(false);
    let crafting = $state(false);
    let searchQuery = $state('');
    let dropdownOpen = $state(false);
    let autoLoadTrigger = $state(0);

    function getSelectedItem() {
        return data.craftableItems.find(item => item.id.toString() === selectedItemId);
    }

    function getInventoryCount(itemId) {
        return data.inventoryMap.get(itemId) || 0;
    }

    function getFilteredItems() {
        if (!searchQuery) return data.craftableItems;
        return data.craftableItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    function selectItem(itemId) {
        selectedItemId = itemId.toString();
        dropdownOpen = false;
    }

    function handleItemChange(event) {
        selectedItemId = event.target.value;
        if (selectedItemId && selectedItemId !== '') {
            
            setTimeout(() => {
                const form = document.getElementById('autoLoadForm') as HTMLFormElement;
                if (form && !loadingRecipes) {
                    form.requestSubmit();
                }
            }, 100);
        }
    }
</script>

<div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Crafting</h1>

    {#if form?.message}
        <div class="alert {form?.success ? 'alert-success' : 'alert-error'} mb-4">
            <span>{form.message}</span>
        </div>
    {/if}

    
    <div class="mb-4">
        <label for="item-select" class="block text-sm font-medium mb-2">Choose item:</label>
        <select 
            id="item-select"
            class="w-full p-2 border rounded"
            value={selectedItemId}
            onchange={handleItemChange}
        >
            <option value="">Select </option>
            {#each data.craftableItems as item (item.id)}
                <option value={item.id}>
                    {item.name} (currently have: {getInventoryCount(item.id)})
                </option>
            {/each}
        </select>

        {#if selectedItemId}
            <form
                method="POST"
                action="?/getRecipes"
                use:enhance={() => {
                    loadingRecipes = true;
                    return async ({ update }) => {
                        await update();
                        loadingRecipes = false;
                    };
                }}
            >
                <input type="hidden" name="itemId" value={selectedItemId} />
                <button type="submit" class="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600" disabled={loadingRecipes}>
                    {loadingRecipes ? 'Loading...' : 'View Recipes'}
                </button>
            </form>
            

            <form
                method="POST"
                action="?/getRecipes"
                id="autoLoadForm"
                use:enhance={() => {
                    loadingRecipes = true;
                    return async ({ update }) => {
                        await update();
                        loadingRecipes = false;
                    };
                }}
            >
                <input type="hidden" name="itemId" value={selectedItemId} />
            </form>
        {/if}
    </div>

    {#if loadingRecipes}
        <div class="text-center py-8">
            <p>Loading recipes...</p>
        </div>
    {/if}

    {#if selectedItemId && !loadingRecipes}
        {@const selectedItem = getSelectedItem()}
        {#if selectedItem}
            <div class="mb-4 p-4 border rounded">
                <h2 class="font-bold">Selected: {selectedItem.name}</h2>
                <p>You have: {getInventoryCount(selectedItem.id)}</p>
            </div>
        {/if}
    {/if}

    {#if form?.recipes && !loadingRecipes}
        {@const selectedItem = getSelectedItem()}
        {#if selectedItem}
            <div class="mt-4">
                <RecipesTable 
                    recipes={form.recipes} 
                    selectedItem={selectedItem} 
                    bind:crafting={crafting} 
                    inventoryMap={data.inventoryMap}
                />
            </div>
        {/if}
    {/if}
</div>