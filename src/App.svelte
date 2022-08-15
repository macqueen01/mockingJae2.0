<script>
	import Navbar from "./Navbar.svelte";
	import Footer from "./Footer.svelte";
	import Content from "./Content.svelte";
</script>

<style>

    :global(body) {
        background-color: #fefff0;
        width: 100%;
        height: 100%;
        font-family: sans-serif;
    }
    
    main {
        height: 100%;
        width: 100%; 
    }
  
</style>

<main>

    <Navbar />
    <Content />
    <Footer />
    
</main>