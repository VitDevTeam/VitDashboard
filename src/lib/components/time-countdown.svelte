<script>
    import { onMount } from 'svelte';
    
    let { endDate } = $props();
  
    let text = $state('');
  
    function tick() {
        const now = Date.now();
        const end = new Date(endDate).getTime();
        const diffSeconds = Math.floor((end - now) / 1000);
        
        if (diffSeconds <= 0) {
            text = 'expired';
            return;
        }
        
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;
        
        if (hours > 0) {
            text = `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            text = `${minutes}m ${seconds}s`;
        } else {
            text = `${seconds}s`;
        }
    }
  
    onMount(() => {
        tick();
        const i = setInterval(tick, 1000);
        return () => clearInterval(i);
    });
</script>
  
<span> Remaining: {text}</span>
