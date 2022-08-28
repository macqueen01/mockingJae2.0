<script>
	import Navbar from "./Navbar.svelte";
	import Container from "./Content.svelte";
	import Content from "./Content.svelte";
	import Footer from "./Footer.svelte";
	import Loading from "./Loading.svelte";
	import Panel from './Panel.svelte';
	
	$: loggedIn = true;
	$: new_load = true;
	
	let dev = true;
	let load_time = 0;
	
	if (!dev) {
	    load_time = 10000;
	}
	

	setTimeout(() => {
	    new_load = false;
	}, load_time)
	
	function loginHandler(e) {
	    loggedIn = e.detail.loggedIn
	    console.log("login status:", loggedIn)
	}
	
	
</script>


<style>
	:global(*) {
		padding: 0;
		margin: 0;
	}

	:global(body) {
		width: 100%;
		height: 100vh;
		background-color: #59545f;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		
	}
	
	.spin-container {
        display: flex;
        /* place the container inside this element center of the screen */
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
	}

</style>

<main>
    {#if new_load}
        <div class="spin-container">
            <Loading dev={dev} />
        </div>
    {:else}
	    <Navbar loggedIn={loggedIn}/>
	    <Content dev={dev} loggedIn={loggedIn} on:login={loginHandler}/>
		{#if !loggedIn}
	    	<Footer />
		{:else}
			<Panel />
		{/if}
    {/if}
</main>