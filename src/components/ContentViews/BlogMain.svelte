<script>
	import sticky from './sticky';
	import BlogHeader from './BlogHeader.svelte';
	export let blog;

	let stickToTop = true;
	let is_stuck = false;
	let img_stuck = false;
	let img_width;

	function stuckHandle(e) {
		is_stuck = e.detail.isStuck;
		img_stuck = e.detail.isStuck;
	}
</script>

<slot name="blog-header">
	<div />
</slot>

<div class="image-wrap" class:is_stuck use:sticky={{ stickToTop }} on:stuck={stuckHandle}>
	<div class="img-container" bind:offsetWidth={img_width}>
		<img src={blog} class:img_stuck class="blog-img" />
	</div>
</div>

<slot name="blog-memes">
	<div />
</slot>

<style>
	.image-wrap {
		position: -webkit-sticky;
		position: sticky;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100vw;
		background-color: white;
		transition: all 0.3s;
		top: 50px;
		z-index: 7;
	}

	.image-wrap.is_stuck {
		height: 50vw;
		background-color: white;
		display: flex;
		flex-direction: row;
	}

	.blog-img {
		height: 100%;
		width: 100%;
		transition: all 0.3s;
	}

	.blog-img.img_stuck {
		height: 100%;
		width: 100%;
	}

	.img-container {
		width: fit-content;
	}

	.info-container {
		width: 0;
		height: 100%;
	}
</style>
