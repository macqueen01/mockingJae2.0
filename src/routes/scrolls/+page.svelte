<script>
    import { onMount } from 'svelte';
	import ScrollComponent from '../../components/ContentViews/ScrollComponent.svelte';
    import ScrollLoader from '../../components/ContentViews/ScrollLoader.svelte';
    import Scrolls from '../../components/ContentViews/Scrolls.svelte';
	import { scrolls } from '../../components/routes';

	onMount(() => {
		scrolls.update(() => true);
	})

	let common_dir = "http://localhost:5173/sequences/"
	let window;

	let scrolls_items = [
		{
			src: `${common_dir}satisfaction2_sequence/satisfaction`,
			length: 921,
			height: 6000,
			startY: 0
		}
	];

	function reloadHandle(e) {
		let endY = e.detail.endY;

		scrolls_items.push({
			src: `${common_dir}satisfaction2_sequence/satisfaction`,
			length: 921,
			height: 6000,
			startY: endY
		});

		scrolls_items = scrolls_items;
		// then should smoothly scroll to the next scrolls 
	}
</script>

<svelte:window />

<div class="home-wrap">
	<!--
	<ScrollComponent dir={`${common_dir}light_lesserafim_sequence/lesserafim`} length={300} height={2000}/>
	<ScrollComponent dir={`${common_dir}heavy_satisfaction_sequence/satisfaction`} length={1063} height={8000}/>
	-->
	{#each scrolls_items as scroll, id}
		<Scrolls
			src={scroll.src}
			length={scroll.length}
			height={scroll.height}
			startY={scroll.startY}
			on:reload|once={reloadHandle}
		/>
	{/each}

	<!--
	<ScrollComponent dir={`${common_dir}ramen_sequence/ramen`} length={2934} height={12000}/>
	-->
</div>

<style>
	.home-wrap {
		width: 100vw;
		height: 100%;
		background-color: transparent;
		margin: 0;
		padding: 0;
		/*
		padding-top: 50px;
		padding-bottom: 15px;
		*/
	}
</style>
