<script>
	import { onMount } from 'svelte';
	import { TweenMax, Linear } from 'gsap';
	import * as fs from 'fs';

	let height = 1000;
	let position = 0;
	// there should be an ideal ratio of height to length
	// this is subject to be studied
	let length = 300;
	let images = [];
	let canvas;
	let ctx;
	let startY;
	let standardHeight;
	let container;

	let maxH;
	let maxW;

	export let src = '';
	export let alt = '';
	export let dir = 'http://172.20.10.9:5173/sequences/demo_lesserafim_sequence/lesserafim';

	// image length * image quality is inverse propotional to loading speed.
	// can't drop the image quality under particular threshold, so video length (image length) should be regulated
	// ==> under ( <= 1000 ) is ideal
	// This also depends on the scroll speed. 
	const imgs = Array(length)
		.fill('')
		.map((_, index) => `${dir}${index + 1}.jpeg`);

	onMount(() => {
		/*
		var obj = { curImg: 0 };

		var tween = TweenMax.to(obj, 0.5, {
			curImg: imgs.length - 1,
			roundProps: 'curImg',
			repeat: 1,
			immediateRender: true,
			ease: Linear.easeNone,
			onUpdate: updateSrc
		});

		var controller = new ScrollMagic.Controller();

		var scene = new ScrollMagic.Scene({ triggerElement: '#trigger', duration: height })
			.setTween(tween)
			.addIndicators()
			.addTo(controller);

		function updateSrc() {
			src = imgs[obj.curImg];
		}
		*/
		if (canvas) {
			ctx = canvas.getContext('2d');
		}
		preload(imgs);
		standardHeight = heightFraction();
		startY = initY();
	});

	//let length = fs.readdirSync(base_sequence_dir).length;

	function preload(lst) {
		for (let i = 0; i < lst.length; i++) {
			const image = new Image();
			image.src = lst[i];
			images.push(image);

			if (i == 0) {
				images[i].onload = () => drawImage(0);
			}
		}
		console.log('done');
	}

	function heightFraction() {
		if (canvas && imgs) {
			console.log(height, imgs.length, height / imgs.length);
			return height / imgs.length;
		}
	}

	function initY() {
		return 0;
	}

	function drawImage(frameIndex) {
		if (canvas && ctx) {
			ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
		}
	}

	function scrollHandle() {
		if (images && standardHeight) {
			let index = getFrameIndex();
			images[index].onload = () => {
				drawImage(index);
			};
			requestAnimationFrame(() => drawImage(index));
		}
	}

	function getFrameIndex() {
		if (canvas && images && standardHeight) {
			let index = Math.floor(position / standardHeight);
			if (index < 0) return 0;
			if (!images[index]) return images.length - 1;

			return index;
		}
	}

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

	$: {
		if (canvas) {
			ctx = canvas.getContext('2d');
		}
	}
</script>

<svelte:window bind:scrollY={position} on:scroll={scrollHandle} />


	<div class="scroll-view">
		<div class="sequence-wrap" style="--height: {height};">
			<div class="img-container" bind:this={container}>
				<canvas bind:this={canvas} />
			</div>
		</div>
	</div>

<style>
	.home-wrap {
		width: 100vw;
		height: 100%;
		background-color: transparent;
		margin: 0;
		padding: 0;
		padding-top: 50px;
		padding-bottom: 15px;
	}

	.hidden-prefetch {
		display: none;
	}

	.scroll-view {
		height: 100%;
		width: 100%;
	}

	.img-container {
		width: 100%;
		position: sticky;
		top: 5%;
		height: 100vh;
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

