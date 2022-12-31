<script>
    import Navbar from "$lib/LayoutComponents/Navbar.svelte";
    import Panel from "$lib/LayoutComponents/Panel.svelte";

    import { onMount } from "svelte";

    let innerHeight = 0;

    onMount(() => {
        function setHeight() {
            let vh = innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        window.addEventListener('resize', () => {
            setHeight();
        });

        setHeight()
    });




</script>


<svelte:window bind:innerHeight={innerHeight} />

<main>
    <div class="navbar-wrap">
        <Navbar />
    </div>
    <div class="content-container">
        <slot></slot>
    </div>
    <div class="panel-wrap">
        <Panel />
    </div>
</main>

<style>
    :global(*) {
		padding: 0;
		margin: 0;
	}

	:global(body) {
		width: 100%;
		background-color: #59545f;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
        height: 100%;
		padding: 0;
		margin: 0;
        display: flex;
	}

    .content-container {
        display: flex;
        /* place the container inside this element center of the screen */
        justify-content: center;
        align-items: center;
        width: 100%;
        height: fit-content;
        background: transparent;
        margin: 0;
        padding: 0;
        /* overflow-y: auto; */
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

    .navbar-wrap {
        width: 100%;
        height: fit-content;
        position: fixed;
        top: 0;
        z-index: 5;
    }

    .panel-wrap {
        width: 100%;
        height: fit-content;
        position: fixed;
        bottom: 0;
        z-index: 4;
    }
</style>