<script>
	import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    // route to login if not logged in
    onMount(() => {
        goto("/login");
    });
    
</script>