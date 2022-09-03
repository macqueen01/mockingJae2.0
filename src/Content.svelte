<style>
    .content-container {
        display: flex;
        /* place the container inside this element center of the screen */
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 100%;
        background-color: #59545f;
        margin: 0;
        padding: 0;
    }
</style>

<script>
    import { createEventDispatcher } from 'svelte';
    
    import Login from "./forms/Login.svelte";
    import SignIn from './forms/SignIn.svelte';
    import Loading from "./Loading.svelte";
    import Home from './Content_views/Home_views/Home.svelte';
    
    
    let loaded = false;
    var dispatch = createEventDispatcher();
    export let dev = true;
    export let loggedIn = false;
    
    //for dev option time set to 0
    let load_time = 0;
    
    if (!dev) {
        load_time = 5000;
    }
    
    $: {
        if (!loaded) {
            setTimeout(() => {
                loaded = true;
            }, load_time)
        }
        
        console.log("loaded: ", loaded)
    }
    
    $: signIn = false;
    
    
    
    function modeChange(e) {
        signIn = e.detail.signIn;
        loaded = false;
        console.log("loaded: ", loaded, "signIn: ", signIn);

    }
    
    function login(e) {
        dispatch('login', {
            loggedIn: true,
        })
    }
    
</script>





<div class="content-container">
    {#if loaded && !signIn && !loggedIn} 
        <Login on:mode={modeChange} />
    {:else if signIn && loaded && !loggedIn}
        <SignIn on:mode={modeChange} />
    {:else if !loaded}
        <Loading />
    {:else if loggedIn && loaded}
        <Home />
    {/if}
</div>



