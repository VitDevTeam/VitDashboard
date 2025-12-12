import { db } from '$lib/db/index';
import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        // Simple health check query
        const result = await db
            .selectFrom('account')
            .select('accountId')
            .limit(1)
            .executeTakeFirst();

        return json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check failed:', error);
        return json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 503 });
    }
}
