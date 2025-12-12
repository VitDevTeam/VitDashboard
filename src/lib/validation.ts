// Super short validation for remote functions
import * as v from 'valibot';

export const leaderboardParams = v.object({
    id: v.string(),
    top: v.optional(v.number(), 10),
    order: v.optional(v.picklist(['asc', 'desc']), 'desc'),
});

export const buyMarketParams = v.object({
    userId: v.string(),
    itemId: v.number(),
    quantity: v.number(),
});

export const marketListingsParams = v.object({
    search: v.optional(v.string(), ''),
    category: v.optional(v.string(), 'all'),
    page: v.optional(v.number(), 1),
    limit: v.optional(v.number(), 10),
});

export const num = v.number();
export const str = v.string();
export const bool = v.boolean();
