import { getMarketListings, getUserStat, getInventoryWithItems, buyMarketItem } from '$lib/remote/db.remote';
import { fail, redirect } from '@sveltejs/kit';
import { getSession } from '$lib/auth/session';

export const load = async (event) => {
    console.log('market/+page.server.ts: load called');
    const session = await getSession(event);
    console.log('market/+page.server.ts: session:', session?.user?.id ? 'authenticated' : 'not authenticated');

    if (!session?.user) {
        console.log('market/+page.server.ts: redirecting to login');
        throw redirect(302, '/login');
    }

    const url = new URL(event.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1');

    try {
        console.log('market/+page.server.ts: calling remote functions with params:', { search, category, page });
        const [marketData, userStats, userInventory] = await Promise.all([
            getMarketListings({ search, category, page, limit: 10 }),
            getUserStat(),
            getInventoryWithItems()
        ]);

        console.log('market/+page.server.ts: remote functions returned');
        console.log('market/+page.server.ts: marketData:', marketData);
        console.log('market/+page.server.ts: userStats:', userStats ? 'found' : 'null');
        console.log('market/+page.server.ts: userInventory length:', userInventory?.length || 0);

        return {
            marketData,
            userStats,
            userInventory
        };
    } catch (error) {
        console.error('market/+page.server.ts: Market load error:', error);
        return {
            marketData: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
            userStats: null,
            userInventory: [],
            error: 'Failed to load market'
        };
    }
};

export const actions = {
    search: async (event) => {
        const data = await event.request.formData();
        const search = data.get('search') as string;
        const category = data.get('category') as string;

        const params = new URLSearchParams();
        if (search?.trim()) params.set('search', search.trim());
        if (category && category !== 'all') params.set('category', category);

        throw redirect(302, `/market?${params.toString()}`);
    },

    page: async (event) => {
        const data = await event.request.formData();
        const page = data.get('page') as string;
        const search = data.get('search') as string;
        const category = data.get('category') as string;

        const params = new URLSearchParams();
        if (search?.trim()) params.set('search', search.trim());
        if (category && category !== 'all') params.set('category', category);
        if (page) params.set('page', page);

        throw redirect(302, `/market?${params.toString()}`);
    },

    buy: async (event) => {
        const session = await getSession(event);
        if (!session?.user) {
            return fail(401, { message: 'Not authenticated' });
        }

        const data = await event.request.formData();
        const itemId = parseInt(data.get('itemId') as string);
        const quantity = parseInt(data.get('quantity') as string);

        if (!itemId || !quantity || quantity < 1) {
            return fail(400, { message: 'Invalid item or quantity' });
        }

    try {
        const result = await buyMarketItem({ userId: session.user.id, itemId, quantity });
        return { success: true, message: result.message };
    } catch (error: any) {
        return fail(400, { message: error.message || 'Purchase failed' });
    }
    }
};
