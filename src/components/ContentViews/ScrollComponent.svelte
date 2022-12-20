<script>
	import { onMount } from "svelte";
	import * as fs from 'fs';

	let position = 0;
	// there should be an ideal ratio of height to length
	// this is subject to be studied
	let images = [];
	let canvas;
	let ctx;
	let startY;
	let standardHeight;
	let container;
	let scrollsElement;
	let maxH;
	let maxW;
	let loaded = false;

	export let src;
	export let alt;
	export let dir;
	export let length = 400;
	export let height = 10000;

	// image length * image quality is inverse propotional to loading speed.
	// can't drop the image quality under particular threshold, so video length (image length) should be regulated
	// ==> under ( <= 1000 ) is ideal
	// This also depends on the scroll speed. 
	const imgs = Array(length)
		.fill('')
		.map((_, index) => `${dir}${index + 1}.jpeg`);

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
		}
		preloadPromise()
			.then((result) => {
				loaded = true;
				standardHeight = heightFraction();
				startY = initPosition().y;
			})
			.catch(e => {
				loaded = false;
				console.log(e)
			});
	});
	//let length = fs.readdirSync(base_sequence_dir).length;

	const preloadPromise = new Promise((resolve, reject) => {
		let preloadResult = preload(imgs);
		if (preloadResult == true) {
			resolve(true);
		} else {
			reject(preloadResult);
		}
	});

	function preload(lst) {

			for (let i = 0; i < lst.length; i++) {
			const image = new Image();
			image.src = lst[i];
			images.push(image);

			if (i == 0) {
				images[i].onload = () => drawImage(0);
			}

			return true;
		}
	}


	function heightFraction() {
		if (canvas && imgs) {
			return height / imgs.length;
		}
	}

	function initPosition() {
		if (scrollsElement) {
			return {
				x: scrollsElement.getBoundingClientRect()['x'],
				y: scrollsElement.getBoundingClientRect()['y']
			}
		}
	}

	function drawImage(frameIndex) {
		if (canvas && ctx) {
			ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
		}
	}

	function scrollHandle() {
		if (position < startY) {
			return null;
		}

		else if (images && standardHeight) {
			let index = getFrameIndex();
			images[index].onload = () => {
				drawImage(index);
			};
			requestAnimationFrame(() => drawImage(index));
		}


	}

	function getFrameIndex() {
		if (canvas && images && standardHeight) {
			let index = Math.floor((position - startY) / standardHeight);
			if (index < 0) return 0;
			if (!images[index]) return images.length - 1;

			return index;
		}
	}

	// Following tools only interv

	function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
		var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

		return {
			width: srcWidth * ratio,
			height: srcHeight * ratio,
			ratio: ratio
		};
	}

	function setCanvasSize() {
		if (container && canvas) {
			maxH = container.height;
			maxW = container.width;

			sizePair = calculateAspectRatioFit(canvas.width, canvas, height, maxW, maxH);
			canvas.height = sizePair.height;
			canvas.width = sizePair.width;
		}
	}
</script>

<svelte:window bind:scrollY={position} on:scroll={scrollHandle} />


	<div class="scroll-view" bind:this={scrollsElement}>
		{#if loaded}
		<div class="sequence-wrap" style="--height: {height};">
			<div class="img-container" bind:this={container}>
				<canvas bind:this={canvas} />
			</div>
		</div>
		{:else}
		<div class="waiting-block">
			No
		</div>
		{/if}
	</div>

<style>
	.scroll-view {
		height: 100%;
		width: 100%;
	}

	.img-container {
		width: 100%;
		position: sticky;
		height: 100vh;
		top: 0;
	}

	.sequence-wrap {
		width: 100%;
		height: calc(var(--height) * 1px);
	}

	canvas {
		width: 100%;
		height: 100%;
	}
</style>

