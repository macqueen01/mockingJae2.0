<style>
</style>

<script>
    export let value = 0
    let count = 0;

    
    function handleClick(event) {
        count++;
    };
    
    
    
</script>


<input type="number" bind:value="{value}">

<p>{value + 1}</p>