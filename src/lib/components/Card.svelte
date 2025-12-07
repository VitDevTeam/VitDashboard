<script lang="ts">
    let { class: className = '', children, ...rest } = $props();
</script>

<div class="card bg-base-100 shadow-xl {className}" {...rest}>
    {#if children}
        {@render children()}
    {/if}
</div>
