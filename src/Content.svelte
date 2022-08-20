<style>
    .content-container {
        display: flex;
        /* place the container inside this element center of the screen */
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: whitesmoke;
        margin: 0;
        padding: 0;
    }
</style>

<script>
    import Login from "./forms/Login.svelte";
    import SignIn from './forms/SignIn.svelte';
    import Loading from "./Loading.svelte";
    
    
    let loaded = false;
    
    $: {
        if (!loaded) {
            setTimeout(() => {
                loaded = true;
            }, 5000)
        }
        
        console.log("loaded: ", loaded)
    }
    
    $: signIn = false;
    
    
    
    function modeChange(e) {
        signIn = e.detail.signIn;
        loaded = false;
        console.log("loaded: ", loaded, "signIn: ", signIn)

    }
    
</script>





<div class="content-container">
    {#if loaded && !signIn} 
        <Login on:mode={modeChange} />
    {:else if signIn && loaded}
        <SignIn on:mode={modeChange} />
    {:else if !loaded}
        <Loading />
    {/if}
</div>



