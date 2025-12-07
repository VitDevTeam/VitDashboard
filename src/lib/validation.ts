// Super short validation for remote functions
import * as v from 'valibot';

export const leaderboardParams = v.object({
    id: v.string(),
    top: v.optional(v.number(), 10),
    order: v.optional(v.picklist(['asc', 'desc']), 'desc'),
});

export const num = v.number();
export const str = v.string();
export const bool = v.boolean();
