<script>
    import { buyMarketItem } from '$lib/remote/db.remote';
    import { emojiToURL } from '$lib/frontend/utils';
    let { data } = $props();

    let { marketData, userStats, userInventory, error } = data;

    let searchTerm = $state('');
    let selectedCategory = $state('all');
    let message = $state('');
    let isLoading = $state(false);
    let buyQuantities = $state({});

   
    let marketItems = $derived(marketData?.items || []);
    let currentPage = $derived(marketData?.page || 1);
    let totalPages = $derived(marketData?.totalPages || 0);
    let totalItems = $derived(marketData?.total || 0);

    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    function getUserItemCount(itemId) {
        const userItem = userInventory.find(item => item.item_id === itemId);
        return userItem ? userItem.quantity : 0;
    }

    async function handleBuy(tradeId, quantity) {
        if (isLoading) return;

        try {
            isLoading = true;
            message = '';

            const trade = marketItems.find(i => i.id === tradeId);
            if (!trade) {
                throw new Error('Trade not found');
            }

            const result = await buyMarketItem({ userId: userStats.id, itemId: tradeId, quantity });

            message = result.message;

            const totalCost = trade.price * quantity;
            userStats.coins = (BigInt(userStats.coins) - BigInt(totalCost)).toString();

            const existingItem = userInventory.find(item => item.item_id === trade.item_id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                userInventory.push({
                    id: userStats.id,
                    item_id: trade.item_id,
                    quantity: quantity,
                    name: trade.name,
                    description: trade.description,
                    icon: trade.icon,
                    is_usable: trade.category === 'Usable'
                });
            }

            marketItems = marketItems.map(item =>
                item.id === tradeId
                    ? { ...item, stock: Math.max(0, item.stock - quantity) }
                    : item
            ).filter(item => item.stock > 0);

        } catch (error) {
            message = error.message || 'Purchase failed';
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>VIT Dashboard - Market</title>
</svelte:head>

<div class="container mx-auto space-y-4">
    <div class="text-center mb-6">
        <h1 class="text-3xl font-bold mb-1">Market</h1>
        <p class="text-base text-base-content/70">Buy items from the market</p>
    </div>

    {#if userStats}
        <div class="stats stats-vertical lg:stats-horizontal shadow w-full mb-4">
            <div class="stat">
                <div class="stat-title">Coins</div>
                <div class="stat-value text-primary">{userStats.coins.toLocaleString()}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Energy</div>
                <div class="stat-value text-secondary">{userStats.energy}/{userStats.energy_max}</div>
            </div>
        </div>
    {/if}

    {#if error}
        <div class="alert alert-error">
            <span>{error}</span>
        </div>
    {/if}

    {#if message}
        <div class="alert {message.includes('Bought') ? 'alert-success' : 'alert-error'}">
            <span>{message}</span>
        </div>
    {/if}

    <div class="card bg-base-100 shadow-xl p-6">
        <form method="POST" action="?/search" class="flex flex-col md:flex-row gap-4">
            <div class="form-control flex-1">
                <input
                    type="text"
                    name="search"
                    placeholder="Search items..."
                    class="input input-bordered w-full"
                    value={searchTerm}
                />
            </div>
            <div class="form-control">
                <select name="category" class="select select-bordered" value={selectedCategory}>
                    <option value="all">All Categories</option>
                    <option value="Non usable">Non usable</option>
                    <option value="Usable">Usable</option>
                </select>
            </div>
            <div class="form-control">
                <button type="submit" class="btn btn-primary">
                    Search
                </button>
            </div>
        </form>
    </div>

    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="overflow-x-auto">
                <table class="table w-full">
                    <thead>
                        <tr>
                            <th>Trade ID</th>
                            <th>Item</th>
                            <th>Seller</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>You Have</th>
                            <th>Buy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each marketItems as item (item.id)}
                            <tr>
                                <td class="font-mono text-sm">{item.trade_id}</td>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <img src={emojiToURL(item.icon)} alt={item.name} class="w-8 h-8" />
                                        <div>
                                            <div class="font-bold">{item.name}</div>
                                            <div class="text-sm opacity-50">{item.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="text-sm opacity-70">
                                        {item.seller_id === userStats?.id ? 'You' : item.seller_name}
                                    </div>
                                </td>
                                <td>
                                    <div class="p-2 rounded-md text-center text-white {item.category === 'Usable' ? 'bg-success' : 'bg-error'}">
                                        {item.category}
                                    </div>
                                </td>
                                <td>{item.price} coins</td>
                                <td>{item.stock}</td>
                                <td>{getUserItemCount(item.item_id)}</td>
                                <td>
                                    <div class="flex gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max={Math.min(99, item.stock)}
                                            class="input input-bordered input-sm w-20"
                                            bind:value={buyQuantities[item.id]}
                                        />
                                        <button
                                            class="btn btn-primary btn-sm"
                                            disabled={userStats && (BigInt(userStats.coins) < BigInt(item.price * (buyQuantities[item.id] || 1)) || isLoading || item.seller_id === userStats.id)}
                                            onclick={() => handleBuy(item.id, buyQuantities[item.id] || 1)}
                                        >
                                            {isLoading ? '...' : 'Buy'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        {#if totalPages > 1}
            <div class="flex justify-between items-center mt-6">
                <div class="text-sm text-base-content/70">
                    Showing {marketItems.length} of {totalItems} items
                </div>
                <div class="flex items-center gap-2">
                    <form method="POST" action="?/page" class="inline">
                        <input type="hidden" name="page" value={currentPage - 1} />
                        <input type="hidden" name="search" value={searchTerm} />
                        <input type="hidden" name="category" value={selectedCategory} />
                        <button
                            type="submit"
                            class="btn btn-sm"
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </form>

                    <span class="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <form method="POST" action="?/page" class="inline">
                        <input type="hidden" name="page" value={currentPage + 1} />
                        <input type="hidden" name="search" value={searchTerm} />
                        <input type="hidden" name="category" value={selectedCategory} />
                        <button
                            type="submit"
                            class="btn btn-sm"
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </form>
                </div>
            </div>
        {:else if marketItems.length > 0}
            <div class="text-sm text-base-content/70 mt-4">
                Showing {marketItems.length} items
            </div>
        {/if}
    </div>

    {#if totalItems === 0}
        <div class="text-center py-12">
            <div class="text-6xl mb-4">:skull:</div>
            <h3 class="text-xl font-bold mb-2">No items found</h3>
            <p class="text-base-content/70">Try adjusting your search or filters</p>
        </div>
    {/if}
</div>
