<script>
	import { onMount } from "svelte";
	import Scrolls from "$lib/Scrolls/Scrolls.svelte";
	import { scrolls } from "$lib/routes";

	onMount(() => {
		scrolls.update(() => true);
	});

	let common_dir = "http://172.20.10.9:5173/sequences/";

	let scrolls_items = [
		{
			src: `${common_dir}satisfaction_sequence/satisfaction`,
			length: 532,
			height: 3000,
			startY: 0,
			id: 0
		},
	];

	let current = 0;

	function reloadHandle(e) {
		let endY = e.detail.endY;
		let newId = scrolls_items.length 

		scrolls_items.push({
			src: `${common_dir}satisfaction2_sequence/satisfaction`,
			length: 921,
			height: 2000,
			startY: endY,
			id: newId
		});

		scrolls_items = scrolls_items;
		// then should smoothly scroll to the next scrolls
	}

	function newHandle(e, id) {
		if (current == id) {
			let startY = e.detail.endY;
			window.scrollTo({
				top: startY,
				behavior: "smooth",
			});
			current += 1;
			goingDown = false;
		}
	}

	
	function rollupHandle(e, index) {
		
		if (index != 0) {
			let startY = e.detail.endY - scrolls_items[index - 1].height;
			window.scrollTo({
				top: startY,
				behavior: "smooth"
			});
		}
		
	}


	
</script>

<div class="home-wrap">
	<!--
		<ScrollComponent dir={`${common_dir}light_lesserafim_sequence/lesserafim`} length={300} height={2000}/>
		<ScrollComponent dir={`${common_dir}heavy_satisfaction_sequence/satisfaction`} length={1063} height={8000}/>
		-->
	{#each scrolls_items as scroll, index}
		<Scrolls
			src={scroll.src}
			length={scroll.length}
			height={scroll.height}
			startY={scroll.startY}
			on:reload|once={reloadHandle}
			on:newload={(e) => newHandle(e, index)}
			on:rollup={(e) => rollupHandle(e, index)}
		/>
		<!--on:rollup={(e) => rollupHandle(e, index)}-->
	{/each}

	<!--
	<ScrollComponent dir={`${common_dir}ramen_sequence/ramen`} length={2934} height={12000}/>
	-->
</div>

<style>
	.home-wrap {
		width: 100vw;
		height: 100vh;
		left: 0;
		background-color: transparent;
		margin: 0;
		padding: 0;
		/*
		padding-top: 50px;
		padding-bottom: 15px;
		*/
	}
</style>
