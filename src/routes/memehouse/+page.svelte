<script>
	import { onMount, afterUpdate } from 'svelte';
	import { scale, fade } from 'svelte/transition';
	import Frame from '$lib/ContentViews/Frame.svelte';

	//import { goto } from '$app/navigation';
	//const preserveScroll = (url) => {
	//goto(url, {
	//noscroll: true,
	//})
	//}

	// call by using {() => preserveScroll('/')}

	let blogger = 'jae';
	let title = 'When you went back home and saw mom and dad having sex';
	let memes = [1, 2, 3, 4];
	let blog = '/icons/svgs/Global_panel.svg';
	let date = '4 hours ago';
	$: height_from_bottom = 10000;
	let refresh = false;
	let add_mode = false;
	let add_mode_meme_id = null;
	let HOME;
	let height;
	let status;

	//onMount(() => {
	//    height = HOME.offsetHeight;
	//    height_from_bottom = height - window.scrollY;
	//})

	//afterUpdate(() => {
	//    height = HOME.offsetHeight;
	//})

	//function updateHandler(e) {
	//    if (HOME) {
	//        height_from_bottom = height - window.scrollY
	//    }
	//}

	$: {
		// loads more blogs
		// fetches blogs from server then updates HOME
		if (height_from_bottom <= 840 && !refresh) {
			refresh = true;
			height_from_bottom = 1000;
			setTimeout(() => {
				window.scrollTo(0, height - 900);
				refresh = false;
			}, 3000);
		}
	}

	$: {
		if (add_mode && add_mode_meme_id) {
			//goto('URL TO MEME HOUSE', {
			//noscroll: true
			//})
		}
	}

	function addMemeHandler(e) {
		add_mode = e.detail.add_mode;
		add_mode_meme_id = e.detail.meme_id;
	}
</script>

<div class="home-wrap" on:wheel={updateHandler} on:touchmove={updateHandler} bind:this={HOME}>
	<Frame {blogger} {title} {date} {memes} {blog} on:add-meme={addMemeHandler} />
	<Frame {blogger} {title} {date} {memes} {blog} />
	<Frame {blogger} {title} {date} {memes} {blog} />
	<Frame {blogger} {title} {date} {memes} {blog} />
	<Frame {blogger} {title} {date} {memes} {blog} />

	<div class="date-line-container">
		<div class="date-line-wrap">
			<h4 class="date-line">
				June 3 2020
				<h4 />
			</h4>
		</div>
	</div>

	<Frame {blogger} {title} {date} {memes} {blog} />
	<Frame {blogger} {title} {date} {memes} {blog} />

	<div class="date-line-container">
		<div class="date-line-wrap">
			<h4 class="date-line">
				June. 4. 2020
				<h4 />
			</h4>
		</div>
	</div>

	<Frame {blogger} {title} {date} {memes} {blog} />
	<Frame {blogger} {title} {date} {memes} {blog} />

	{#if !refresh}
		<div class="pull-container" transition:scale|local={{ duration: 400, opacity: 0, start: 0 }}>
			<div class="pull-wrap">
				<h4 class="pull-line">
					Pull to load more
					<h4 />
				</h4>
			</div>
		</div>
	{:else if refresh}
		<div class="refresher" transition:scale|local={{ duration: 300, opacity: 0, start: 0 }}>
			<div class="refresher-inner-wrap">
				<img
					src="/icons/svgs/pizzaSpinner.svg"
					height="25"
					width="25"
					class="pizza-spinner-refresh"
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.home-wrap {
		width: 100vw;
		height: fit-content;
		background-color: transparent;
		margin: 0;
		padding: 0;
		padding-top: 50px;
		padding-bottom: 15px;
	}

	.date-line-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		width: 100%;
		height: 50px;
	}

	.refresher {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100px;
	}

	.refresher-inner-wrap {
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		width: 200px;
		padding-bottom: 50px;
	}

	.pizza-spinner-refresh {
		animation: rotation 2s infinite linear;
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}

	.pull-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50px;
	}

	.date-line-wrap {
		display: flex;
		justify-content: center;
		display: relative;
		flex-direction: row;
		align-items: center;
		width: 200px;
		padding-top: 30px;
		padding-left: 5px;
		padding-right: 3px;
		justify-content: flex-end;
		padding-bottom: 0;
	}

	.date-line {
		color: #d9d7d7;
		font-family: popLight;
		font-size: 14px;
	}

	.pull-wrap {
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		width: 200px;
	}

	.pull-line {
		color: white;
		margin-left: 7px;
		font-family: popExtraLight;
		font-size: 13px;
	}
</style>
