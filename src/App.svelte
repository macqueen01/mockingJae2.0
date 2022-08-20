<script>
	import Navbar from "./Navbar.svelte";
	import Container from "./Content.svelte";
	import Content from "./Content.svelte";
	import Footer from "./Footer.svelte";
	import Loading from "./Loading.svelte";
	
	$: loggedIn = false;
	$: new_load = true;
	
	setTimeout(() => {
	    new_load = false;
	}, 10000)
	
	
	
</script>


<style>
	:global(*) {
		padding: 0;
		margin: 0;
	}

	:global(body) {
		width: 100%;
		height: 100%;
		background-color: #FEF7DC;
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
            <Loading />
        </div>
    {:else}
	    <Navbar />
	    <Content />
	    <Footer />
    {/if}
</main>