import { db } from '$lib/db/index';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { getSession } from '$lib/auth/session';
import type { ServerLoad, Actions } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
    const session = await getSession(event);

    // Optimized single query to get craftable items with user's inventory in one go
    const craftableItemsWithInventory = await db
        .selectFrom('items as i')
        .distinctOn('i.id')
        .select(['i.id', 'i.name', 'i.icon'])
        .leftJoin('inventory as inv', (join) =>
            join.onRef('inv.item_id', '=', 'i.id')
                .on('inv.id', '=', session.user.id)
        )
        .select(['inv.quantity as user_quantity'])
        .innerJoin('recipe_results as rr', 'i.id', 'rr.item_id')
        .orderBy('i.id')
        .orderBy('i.name')
        .execute();

    // Create inventory map for easy lookup
    const inventoryMap = new Map();
    craftableItemsWithInventory.forEach(item => {
        inventoryMap.set(item.id, item.user_quantity || 0);
    });

    // Extract craftable items without inventory data
    const craftableItems = craftableItemsWithInventory.map(({ user_quantity, ...item }) => item);

    return { craftableItems, inventoryMap };
};

export const actions: Actions = {
    getRecipes: async ({ request, locals }) => {
        const formData = await request.formData();
        const itemId = formData.get('itemId') as string;

        if (!itemId) {
            return fail(400, { message: 'Item ID is required' });
        }

        try {
            const recipes = await db
                .selectFrom('recipes as r')
                .selectAll('r')
                .innerJoin('recipe_results as rr', 'r.id', 'rr.recipe_id')
                .where('rr.item_id', '=', parseInt(itemId, 10))
                .execute();

            const recipesData = await Promise.all(
                recipes.map(async (recipe) => {
                    const requirements = await db
                        .selectFrom('recipe_require_items as rri')
                        .innerJoin('items as i', 'rri.item_id', 'i.id')
                        .select(['i.name', 'i.icon', 'rri.quantity', 'rri.is_consumed', 'i.id as item_id'])
                        .where('rri.recipe_id', '=', recipe.id)
                        .execute();

                    const results = await db
                        .selectFrom('recipe_results as rr')
                        .innerJoin('items as i', 'rr.item_id', 'i.id')
                        .select(['i.name', 'i.icon', 'rr.quantity', 'i.id as item_id'])
                        .where('rr.recipe_id', '=', recipe.id)
                        .execute();

                    return { ...recipe, requirements, results };
                })
            );

            return { recipes: recipesData };
        } catch (error) {
            console.error('Error fetching recipes:', error);
            return fail(500, { message: 'Failed to fetch recipes' });
        }
    },
    craft: async ({ request }) => {
        const session = await getSession();
        if (!session?.user) {
            return fail(401, { message: 'Unauthorized' });
        }

        const formData = await request.formData();
        const recipeId = parseInt(formData.get('recipeId') as string, 10);
        const amount = parseInt(formData.get('amount') as string, 10);

        if (isNaN(recipeId) || isNaN(amount) || amount < 1) {
            return fail(400, { message: 'Invalid recipe or amount' });
        }

        try {
            const result = await db.transaction().execute(async (trx) => {
                const requirements = await trx
                    .selectFrom('recipe_require_items as rri')
                    .innerJoin('items as i', 'rri.item_id', 'i.id')
                    .select(['i.id', 'i.name', 'rri.quantity', 'rri.is_consumed'])
                    .where('rri.recipe_id', '=', recipeId)
                    .execute();

                for (const req of requirements) {
                    const inventoryItem = await trx
                        .selectFrom('inventory')
                        .select('quantity')
                        .where('id', '=', session.user.id)
                        .where('item_id', '=', req.id)
                        .executeTakeFirst();

                    const needed = req.quantity * amount;
                    if (!inventoryItem || inventoryItem.quantity < needed) {
                        throw new Error(`Insufficient materials: ${req.name}`);
                    }
                }

                for (const req of requirements) {
                    if (req.is_consumed) {
                        const needed = req.quantity * amount;
                        await trx
                            .updateTable('inventory')
                            .set((eb) => ({
                                quantity: eb('quantity', '-', needed)
                            }))
                            .where('id', '=', session.user.id)
                            .where('item_id', '=', req.id)
                            .execute();
                    }
                }

                await trx
                    .deleteFrom('inventory')
                    .where('id', '=', session.user.id)
                    .where('quantity', '<=', 0)
                    .execute();

                const results = await trx
                    .selectFrom('recipe_results as rr')
                    .select(['rr.item_id', 'rr.quantity'])
                    .where('rr.recipe_id', '=', recipeId)
                    .execute();

                for (const res of results) {
                    const totalQuantity = res.quantity * amount;
                    await trx
                        .insertInto('inventory')
                        .values({
                            id: session.user.id,
                            item_id: res.item_id,
                            quantity: totalQuantity
                        })
                        .onConflict((oc) => oc
                            .columns(['id', 'item_id'])
                            .doUpdateSet((eb) => ({
                                quantity: eb('quantity', '+', totalQuantity)
                            }))
                        )
                        .execute();
                }

                return { success: true, message: 'Crafting successful!' };
            });

            return result;
        } catch (error: any) {
            return fail(500, { message: error.message || 'Crafting failed' });
        }
    }
};
