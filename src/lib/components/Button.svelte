<script lang="ts">
    type ButtonType = 'button' | 'submit' | 'reset';
    let { class: className = '', type = 'button' as ButtonType, disabled = false, children, ...rest } = $props();
</script>

<button {type} {disabled} class="btn {className}" {...rest}>
    {#if children}
        {@render children()}
    {/if}
</button>
