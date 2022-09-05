
<style>

    .btn-container {
        height: 48px;
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .btn {
        height: 70%;
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fdf9e6;
        color: #413c47;
        font-family: popRegular;
        font-size: 14px;
        border-radius: 4px;
        padding: 0;
        margin: 0;
        border: thin solid #59545f
    }
    
</style>


<script>

    import { createEventDispatcher } from 'svelte';
    
    export let innerText = "";
    export let func = () => {};
    
    var dispatch = createEventDispatcher();
    
    function handleFunction() {
        dispatch('click', {
            callback: func();
        })
    }

</script>


<div class="btn-container">
    <div class="btn" on:click={handleFunction}>
        <label class="label-memehouse">
            {innerText}
        </label>
    </div>
</div>