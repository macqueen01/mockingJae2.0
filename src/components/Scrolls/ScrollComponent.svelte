<script>
	import SvelteHeader from './SvelteHeader.svelte';

	import { onMount, createEventDispatcher } from 'svelte';
	import * as fs from 'fs';

	let position = 0;
	// there should be an ideal ratio of height to length
	// this is subject to be studied
	let images = [];
	let canvas;
	let ctx;
	
	let standardHeight;
	let container;
	let scrollsElement;
	let lastIndex;
	let focus = false;
	let active = true;
	let headerActive = true;

	

	let dispatch = new createEventDispatcher();

	export let src;
	export let alt;
	export let length;
	export let height;
	export let startY;
	export let order;

	// image length * image quality is inverse propotional to loading speed.
	// can't drop the image quality under particular threshold, so video length (image length) should be regulated
	// ==> under ( <= 1000 ) is ideal
	// This also depends on the scroll speed.
	const imgs = Array(length)
		.fill('')
		.map((_, index) => `${src}${index + 1}.jpeg`);

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
		}

		preload(imgs);
	});
	//let length = fs.readdirSync(base_sequence_dir).length;

	function preload(lst) {
		lastIndex = lst.length - 1;
		for (let i = 0; i < lst.length; i++) {
			const image = new Image();
			image.src = lst[i];
			images.push(image);
			if (i == 0) {
				image.onload = () => drawImage(0);
			} else if (i == lst.length - 1) {
				dispatch('load', {
					load: true
				});
				standardHeight = heightFraction();
				console.log(startY);
			}
		}
	}

	function heightFraction() {
		if (canvas && imgs) {
			return height / imgs.length;
		}
	}

	function drawImage(frameIndex) {
		if (canvas && ctx) {
			ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
		}
	}

	function scrollHandle(e) {
		// only allow scroll when ready
		if (!(images && standardHeight)) {
			e.preventDefault();
			return null;
		}
		
		// rolls up to the scrolls before the current scrolls
		if (startY - position > 30 && focus) {
			focus = true;
			headerActive = false;
			dispatch('rollup', {
				endY: startY
			});
		}

		// start showing header
		if (startY - position < 400) {
			headerActive = true;
		}

		// stop showing header
		if (position + window.screenY < startY) {
			headerActive = false;
			focus = false;
		}

		if (startY < position && height + startY - position > 30 && headerActive) {
			focus = true;
			let index = getFrameIndex();
			images[index].onload = () => {
				drawImage(index);
			};
			requestAnimationFrame(() => drawImage(index));

			if (index >= lastIndex * 0.5) {
				dispatch('reload', {
					endY: startY + height
				});
			}

			if (index == lastIndex) {
				focus = false;
				dispatch('push', {
					id: order,
					focus: focus
				});
			}
		}
		
		if (0 < height + startY - position && height + startY - position < 50 && focus) {
			/*
			window.scrollTo({
				top: startY + height,
				behavior: 'instant'
			});
			*/
			focus = false;
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
	/*

	function setCanvasSize() {
		if (container && canvas) {
			maxH = container.height;
			maxW = container.width;

			sizePair = calculateAspectRatioFit(
				canvas.width,
				canvas,
				height,
				maxW,
				maxH
			);
			canvas.height = sizePair.height;
			canvas.width = sizePair.width;
		}
	}
	*/

	// Custom actions
</script>

<svelte:window bind:scrollY={position} on:scroll={scrollHandle} />

<div class="scroll-view-loaded" bind:this={scrollsElement}>
	<div class="sequence-wrap" style="--height: {height};">
		<div class="sequence-container" bind:this={container}>
			<div class="header-content-container">
				<SvelteHeader active={headerActive}/>
				<canvas bind:this={canvas} />
			</div>
		</div>
	</div>
</div>

<style>
	.scroll-view-loaded {
		height: fit-content;
		width: 100%;
	}

	.sequence-container {
		width: 100%;
		position: sticky;
		height: 100vh;
		top: 0;
	}

	.header-content-container {
		width: 100%;
		height: 100%;
		position: relative;
		top: 0;
	}

	.sequence-wrap {
		width: 100%;
		height: calc(var(--height) * 1px);
	}

	canvas {
		width: 100%;
		height: 100%;
		border-radius: 15px;
	}


</style>
