<script>
	import SvelteHeader from "./SvelteHeader.svelte";

	import { fetchScrollsFromId } from "$lib/api";

	import { onMount, createEventDispatcher } from "svelte";
	import axios from "axios";
	import untar from "js-untar";
	import Buffer from "buffer";
	import { create } from "ipfs-http-client";

	let position = 0;
	let status = 0;
	// there should be an ideal ratio of height to length
	// this is subject to be studied
	let images = [];
	let imgs = [];
	let canvas;
	let ctx;
	let windowHeight;
	let windowWidth;
	let loaded = false;

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
	export let scrolls_id = 11;

	const client = create({
		host: "ipfs.io",
		port: 443,
		protocol: "https",
	});

	// image length * image quality is inverse propotional to loading speed.
	// can't drop the image quality under particular threshold, so video length (image length) should be regulated
	// ==> under ( <= 1000 ) is ideal
	// This also depends on the scroll speed.

	onMount(async () => {
		if (canvas) {
			ctx = canvas.getContext("2d");
		}

		imgs = await fetchScrolls(scrolls_id);

		preload(imgs);
	});

	async function fetchScrolls(id) {
		// fetches scrolls with given id
		// after fetching, parses into image list (in order of Cell index)
		// returns the parsed image list

		let result = await axios(fetchScrollsFromId(id));

		height = result.data.height;
		length = result.data.length;
		let hash = result.data.ipfs_hash;

		let urlList = [];

		// fills urlList with 0 in LENGTH
		for (let i = 0; i < length; i++) {
			urlList.push(0);
		}

		let tarArchive = Buffer.Buffer.alloc(0);

		// Send an HTTP GET request to the /api/v0/get endpoint to download the IPFS directory as a tar archive
		const tarArchiveBuffer = client.get(hash, { archive: true });
		for await (const chunk of tarArchiveBuffer) {
			tarArchive = Buffer.Buffer.concat([tarArchive, chunk]);
		}

		const buffer = new Uint8Array(tarArchive).buffer;

		const files = await untar(buffer);

		for (let i = 0; i < files.length; i++) {
			if (
				files[i].name.endsWith(".jpeg") ||
				files[i].name.endsWith(".jpg")
			) {
				const blob = blobbifyFile(files[i]);
				let index = blob.name.split("/").pop().split(".")[0] - 1;
				urlList[index] = { name: blob.name, url: blob.url };
			}
		}

		return urlList;
	}

	function blobbifyFile(file) {
		const data_blob = file.blob;
		const img_blob = new Blob([data_blob], { type: 'image/jpeg' })
		const url = URL.createObjectURL(img_blob);
		return { name: file.name, url: url };
	}

	function removeBlob(blob) {
		if (blob) {
			URL.revokeObjectURL(blob.url);
			return true;
		}
		return false;
	}


	function preload(lst) {
		lastIndex = lst.length - 1;
		for (let i = 0; i < lst.length; i++) {
			const image = new Image();
			image.src = lst[i].url;
			images.push(image);
			if (i == 0) {
				image.onload = () => {
					drawImage(0);
				};
			} else if (i == lst.length - 1) {
				standardHeight = heightFraction();
				image.onload = () =>
					dispatch("load", {
						load: true,
					});
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
			ctx.drawImage(
				images[frameIndex],
				0,
				0,
				canvas.width,
				canvas.height
			);
			status = (frameIndex + 1) / (lastIndex + 1);
		}
	}

	function scrollHandle(e) {
		// only allow scroll when ready
		if (!(images && standardHeight)) {
			e.preventDefault();
			return null;
		}

		// rolls up to the scrolls before the current scrolls
		if (e.deltaY < 0) {
			if (startY - window.scrollY > 30) {
				focus = true;
				headerActive = false;
				e.preventDefault();
				dispatch("rollup", {
					endY: startY,
				});
			}
		}

		/*
		if (startY - position > 30 && focus) {
			focus = true;
			headerActive = false;
			dispatch("rollup", {
				endY: startY,
			});
		}
		*/

		// start showing header
		if (startY - position < 400) {
			headerActive = true;
		}

		// stop showing header
		if (position + window.screenY < startY) {
			headerActive = false;
			focus = false;
		}

		if (
			startY < position &&
			height + startY - position > 30 &&
			headerActive
		) {
			focus = true;
			let index = getFrameIndex();
			images[index].onload = () => {
				drawImage(index);
			};
			requestAnimationFrame(() => drawImage(index));

			if (index >= 1) {
				dispatch("reload", {
					endY: startY + height,
				});
			}

			if (index == lastIndex) {
				focus = false;
				dispatch("push", {
					id: order,
					focus: focus,
				});
			}
		}

		if (
			0 < height + startY - position &&
			height + startY - position < 50 &&
			focus
		) {
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
			ratio: ratio,
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

<svelte:window
	bind:scrollY={position}
	on:scroll={scrollHandle}
	bind:innerWidth={windowWidth}
	bind:innerHeight={windowHeight}
/>

<div class="scroll-view-loaded" bind:this={scrollsElement}>
	<div class="sequence-wrap" style="--height: {height};">
		<div class="sequence-container" bind:this={container}>
			<div class="header-content-container">
				<SvelteHeader active={headerActive} {status} />
				<canvas width={windowWidth} height="720" bind:this={canvas} />
			</div>
		</div>
	</div>
</div>

<style>
	.scroll-view-loaded {
		height: fit-content;
		width: 100%;
		border-bottom: solid 3px black;
	}

	.sequence-container {
		width: 100%;
		position: sticky;
		height: calc(100vh - 55px);
		top: 55px;
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
		border-radius: 18px;
	}
</style>
