<script lang="ts">
    import { emojiToURL } from '$lib/frontend/utils';

    let { inventory } = $props();
</script>

<div class="overflow-x-auto">
    <table class="table w-full">
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {#each inventory.filter(item => item.quantity > 0) as item (item.id + '-' + item.item_id)}
                <tr>
                    <td>
                        <div class="flex items-center space-x-3">
                            <div class="avatar placeholder">
                                <div class="w-12 h-12 bg-neutral-focus text-neutral-content rounded-full">
                                    {#if item.icon && emojiToURL(item.icon)}
                                        <img src={emojiToURL(item.icon)} alt={item.name} />
                                    {:else}
                                        <span>{item.item_id}</span>
                                    {/if}
                                </div>
                            </div>
                            <div>
                                <div class="font-bold">{item.name || `Item #${item.item_id}`}</div>
                                <div class="text-sm opacity-50">{item.description || ''}</div>
                            </div>
                        </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                        <div class="p-2 rounded-md text-center text-white {item.item_id === 1 || item.item_id === 4 || item.item_id === 8 ? 'bg-success' : 'bg-error'}">
                            {item.item_id === 1 || item.item_id === 4 || item.item_id === 8 ? 'Usable' : 'Not Usable'}
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
