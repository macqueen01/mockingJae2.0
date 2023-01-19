<script>
	import SvelteHeader from "./SvelteHeader.svelte";

	import { fetchScrollsFromId } from "$lib/api";
	import { scrolls_data } from "$lib/states";

	import { onMount, createEventDispatcher } from "svelte";
	import axios from "axios";
	import untar from "js-untar";
	import Buffer from "buffer";
	import { create } from "ipfs-http-client";
	import { ImageList } from "$lib/Scrolls/structs";

	let position = 0;
	let status = 0;
	// there should be an ideal ratio of height to length
	// this is subject to be studied
	let _images = new ImageList();
	let imgs = [];
	let canvas;
	let ctx;
	let windowHeight;
	let windowWidth;
	let loaded = false;

	let standardHeight;
	let container;
	let scrollsElement;
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

		await loadImages(scrolls_id);
	});

	// Set the id of the fetched scrolls of scrolls_data to its data buffer (Uint8Array) and dispatches
	// the event to the parent component (Scrolls.svelte) to update the scrolls_data

	// maybe setting this 'scrolls_data' as a storage might be better...
	function setScrollsData(scrolls_id, buffer) {
		const scrolls_data = bufToStr(buffer);
		window.localStorage.setItem(scrolls_id, scrolls_data);
	}

	function getScrollsData(scrolls_id) {
		if (window.localStorage.getItem(scrolls_id) == null) {
			return false;
		}

		const str_data = window.localStorage.getItem(`${scrolls_id}`);
		const scrolls_data = strToBuf(str_data);
		return scrolls_data;
	}

	async function fetchScrolls(id) {
		// fetches scrolls with given id
		// after fetching, parses into image list (in order of Cell index)
		// returns the parsed image list

		// DIAGRAM OF CREATION OF SCROLLS. LIFE CYCLE OF SCROLLS...
		// 1. fetch scrolls id and hash from backend --> (fetchScrollsFromId)
		// 2. fetch the tar buffer from ipfs (as Uint8Array) --> (hashToTar)
		// 3. create blobs --both image and data-- from the tar buffer and set the url list --> (bufferToBlobs)
		// 4. for later use, set the buffer to its scrolls_id in the scrolls_data --> (setScrollsData)

		let result = await axios(fetchScrollsFromId(id));

		height = result.data.height;
		length = result.data.length;
		let hash = result.data.ipfs_hash;

		const buffer = await hashToTar(hash);

		/*
		setScrollsData(result.data.id, buffer);
		*/

		const blobData = await bufferToBlobs(buffer);

		const urlList = blobData.urlList;
		const img_blobs = blobData.img_blobs;
		const data_blobs = blobData.data_blobs;

		return {
			urlList: urlList,
			img_blobs: img_blobs,
			data_blobs: data_blobs,
		};
	}

	function blobbifyFile(file) {
		const data_blob = file.blob;
		const img_blob = new Blob([data_blob], { type: "image/jpeg" });
		const url = URL.createObjectURL(img_blob);
		return {
			name: file.name,
			url: url,
			img_blob: img_blob,
			data_blob: data_blob,
		};
	}

	function removeBlob(url) {
		if (url) {
			URL.revokeObjectURL(url);
			return true;
		}
		return false;
	}

	function removeAllBlobs(images) {
		let i = 0;
		images.forEach((image) => (i != 0 ? removeBlob(image.src) : i++));
		return true;
	}

	function cleanMemory() {
		if (!focus) {
			console.log("cleaning memory...");
			removeAllBlobs(_images.getImages());
			let thumbnail = _images.getThumbnail();

			for (let i = 0; i < _images.getLength(); i++) {
				_images.setImage(i, thumbnail.url);
			}
		}
	}

	async function bufferToBlobs(buffer) {
		let urlList = [];
		let img_blobs = [];
		let data_blobs = [];

		// fills urlList with 0 in LENGTH
		for (let i = 0; i < length; i++) {
			urlList.push(0);
		}

		const files = await untar(buffer);

		for (let i = 0; i < files.length; i++) {
			if (
				files[i].name.endsWith(".jpeg") ||
				files[i].name.endsWith(".jpg")
			) {
				const blob = blobbifyFile(files[i]);
				let index = blob.name.split("/").pop().split(".")[0] - 1;

				urlList[index] = { name: blob.name, url: blob.url };
				img_blobs.push(blob.img_blob);
				data_blobs.push(blob.data_blob);
			}
		}

		return {
			urlList: urlList,
			img_blobs: img_blobs,
			data_blobs: data_blobs,
		};
	}

	async function hashToTar(hash, http_client = client) {
		let tarArchive = Buffer.Buffer.alloc(0);

		// Send an HTTP GET request to the /api/v0/get endpoint to download the IPFS directory as a tar archive
		const tarArchiveBuffer = client.get(hash, { archive: true });
		for await (const chunk of tarArchiveBuffer) {
			tarArchive = Buffer.Buffer.concat([tarArchive, chunk]);
		}

		const buffer = new Uint8Array(tarArchive).buffer;

		return buffer;
	}

	function preload(lst) {
		const images = [];
		const lastIndex = lst.length - 1;
		for (let i = 0; i < lst.length; i++) {
			const image = new Image();
			image.src = lst[i].url;

			images.push(image);
			if (i == 0) {
				image.onload = () => {
					drawImage(0);
				};
			} else if (i == lst.length - 1) {
				image.onload = () =>
					dispatch("load", {
						load: true,
					});
			}
		}

		return images;
	}

	async function loadImages(scrolls_id) {
		// loads images from the scrolls_data
		// if the scrolls_data doesn't have the scrolls_id, fetches the scrolls from backend
		// and then loads the images

		let urlList = [];
		let img_blobs = [];
		let data_blobs = [];

		const fetchedResult = await fetchScrolls(scrolls_id);

		urlList = fetchedResult.urlList;
		img_blobs = fetchedResult.img_blobs;
		data_blobs = fetchedResult.data_blobs;

		/*

		if (window.localStorage.getItem(`${scrolls_id}`) == null) {
			const fetchedResult = await fetchScrolls(scrolls_id);

			urlList = fetchedResult.urlList;
			img_blobs = fetchedResult.img_blobs;
			data_blobs = fetchedResult.data_blobs;
		} else {
			const data = getScrollsData(scrolls_id);
			const buffer = new Uint8Array(data).buffer;
			const blobData = await bufferToBlobs(buffer);

			urlList = blobData.urlList;
			img_blobs = blobData.img_blobs;
			data_blobs = blobData.data_blobs;
		}

		*/

		const images = preload(urlList);
		_images.setImages(images);
		_images.setThumbnail(img_blobs[0]);
		standardHeight = heightFraction();
	}

	function heightFraction() {
		return height / _images.getLength();
	}

	function drawImage(frameIndex) {
		if (canvas && ctx) {
			ctx.drawImage(
				_images.getFrameIndex(frameIndex),
				0,
				0,
				canvas.width,
				canvas.height
			);
		}
	}

	function scrollHandle(e) {
		// only allow scroll when ready
		if (!(_images.getLastIndex() && standardHeight)) {
			e.preventDefault();
			return null;
		}

		// rolls up to the scrolls before the current scrolls

		if (startY - position > 30 && focus) {
			focus = true;
			headerActive = false;
			dispatch("rollup", {
				endY: startY,
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

		if (
			startY < position &&
			height + startY - position > 30 &&
			headerActive
		) {
			focus = true;
			let index = getFrameIndex();
			_images.getFrameIndex(index).onload = () => {
				drawImage(index);
			};
			requestAnimationFrame(() => drawImage(index));
			status = (index + 1) / _images.getLength();

			if (index >= 1) {
				dispatch("reload", {
					endY: startY + height,
				});
			}

			if (index == _images.getLastIndex()) {
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

	/*
	$: {
		if (!focus && startY != 0) {
			setTimeout(cleanMemory(), 60000);
		}
	}
	*/

	function getFrameIndex() {
		if (canvas && _images && standardHeight) {
			let index = Math.floor((position - startY) / standardHeight);
			if (index < 0) return 0;
			if (!_images.getFrameIndex(index)) return _images.getLength() - 1;

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

	// Following tools only intervene in the local storage
	// used to convert the data to blob and store it in the local storage
	// and then convert it back to data when needed

	// For current version, these utilities does not work for large buffer --> need to be fixed

	function bufToStr(buf) {
		var arrayBuffer = new Uint8Array(buf);
		var s = String.fromCharCode.apply(null, arrayBuffer);

		decodeURIComponent(s);
	}

	function strToBuf(str) {
		var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
		var bufView = new Uint8Array(buf);
		for (var i = 0, strLen = str.length; i < strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}
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
