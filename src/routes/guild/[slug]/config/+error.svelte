<script>
    import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-6">
    <div class="card bg-base-100 shadow-xl max-w-md w-full">
        <div class="card-body items-center text-center">
            <div class="text-6xl mb-4">:skull:</div>
            <h2 class="card-title">
                {$page.status === 403 ? 'Access Denied' : 'Error'}
            </h2>
            <p>{$page.error?.message || 'An error occurred'}</p>
            <div class="card-actions justify-center gap-4 mt-4">
                <a href="/guild" class="btn btn-primary">
                    Back to Guilds
                </a>
                <a href="/" class="btn btn-ghost">
                    Home
                </a>
            </div>
        </div>
    </div>
</div>
