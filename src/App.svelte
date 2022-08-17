<script>
	import Navbar from "./Navbar.svelte";
	import Container from "./Content.svelte";
	import Content from "./Content.svelte";
	import Footer from "./Footer.svelte";
	
	$: loggedIn = false;
	
	
	
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

</style>

<main>
	<Navbar logged/>
	<Content />
	<Footer />
</main>