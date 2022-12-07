<script>
	import BlogHeader from './BlogHeader.svelte';

	import { beforeUpdate, onMount } from 'svelte';
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';

	export let memes = [1, 2, 3, 4];
	export let meme_id = 1;
	export let add_mode = false;

	let y_position;
	var dispatch = createEventDispatcher();

	$: first = false;
	$: second = false;
	$: third = false;
	$: forth = false;
	$: add_mode = false;

	$: visible = false;

	function bubbleUpAddMode() {
		dispatch('add-meme', {
			meme_id: meme_id,
			add_mode: true
		});
	}

	function positionBubbleUp() {
		console.log(y_position);
	}
</script>

{#if add_mode == false}
	<div class="memes" transition:fade|local={{ duration: 200, easing: quintOut }}>
		<div
			class="first-meme"
			on:click={() => {
				first = true;
				second = third = forth = false;
				setTimeout(() => {
					first = false;
				}, 2000);
			}}
		>
			<img src="/icons/svgs/star.svg" height="100%" />
			{#if first}
				<div class="meme" transition:fade={{ duration: 200 }}>
					<img src="/icons/svgs/Dm.svg" height="30" />
					<a>
						<svg
							version="1.0"
							xmlns="http://www.w3.org/2000/svg"
							width="30"
							height="30"
							viewBox="0 0 792.000000 792.000000"
							preserveAspectRatio="xMidYMid meet"
						>
							<g
								transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
								fill="#f5f5f5"
								stroke="none"
							>
								<path
									d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"
								/>
								<path
									d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"
								/>
								<path
									d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"
								/>
							</g>
						</svg>
					</a>
				</div>
			{/if}
		</div>
		<div
			class="second-meme"
			on:click={() => {
				second = true;
				first = third = forth = false;
				setTimeout(() => {
					second = false;
				}, 2000);
			}}
		>
			{#if second}
				<div class="meme" transition:fade={{ duration: 200 }}>
					<svg
						version="1.0"
						xmlns="http://www.w3.org/2000/svg"
						width="30"
						height="30"
						viewBox="0 0 792.000000 792.000000"
						preserveAspectRatio="xMidYMid meet"
					>
						<g
							transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
							fill="#f5f5f5"
							stroke="none"
						>
							<path
								d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"
							/>
							<path
								d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"
							/>
							<path
								d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"
							/>
						</g>
					</svg>
				</div>
			{/if}
		</div>
		<div
			class="third-meme"
			on:click={() => {
				third = true;
				second = first = forth = false;
				setTimeout(() => {
					third = false;
				}, 2000);
			}}
		>
			{#if third}
				<div class="meme" transition:fade={{ duration: 200 }}>
					<svg
						version="1.0"
						xmlns="http://www.w3.org/2000/svg"
						width="30"
						height="30"
						viewBox="0 0 792.000000 792.000000"
						preserveAspectRatio="xMidYMid meet"
					>
						<g
							transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
							fill="#f5f5f5"
							stroke="none"
						>
							<path
								d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"
							/>
							<path
								d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"
							/>
							<path
								d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"
							/>
						</g>
					</svg>
				</div>
			{/if}
		</div>
		<div
			class="forth-meme"
			on:click={() => {
				forth = true;
				second = third = first = false;
				setTimeout(() => {
					forth = false;
				}, 2000);
			}}
		>
			{#if forth}
				<div class="meme" transition:fade={{ duration: 200 }}>
					<svg
						version="1.0"
						xmlns="http://www.w3.org/2000/svg"
						width="30"
						height="30"
						viewBox="0 0 792.000000 792.000000"
						preserveAspectRatio="xMidYMid meet"
					>
						<g
							transform="translate(0.000000,792.000000) scale(0.100000,-0.100000)"
							fill="#f5f5f5"
							stroke="none"
						>
							<path
								d="M4047 7664 c-126 -27 -217 -78 -338 -189 -36 -33 -84 -72 -107 -87
-93 -64 -172 -262 -172 -431 1 -335 295 -564 665 -517 188 23 322 71 435 156
111 84 164 178 206 365 21 94 25 133 22 225 -3 104 -5 114 -40 186 -113 227
-396 351 -671 292z"
							/>
							<path
								d="M4032 4675 c-97 -27 -161 -67 -276 -171 -122 -110 -161 -163 -200
-266 -105 -279 -51 -563 141 -738 230 -210 586 -181 883 74 115 99 205 242
230 371 25 122 -7 268 -86 392 -47 75 -194 219 -266 261 -132 78 -310 110
-426 77z"
							/>
							<path
								d="M3923 1595 c-190 -52 -342 -165 -399 -300 -9 -22 -18 -71 -20 -110
-1 -38 -12 -106 -23 -150 -70 -264 -35 -496 98 -647 134 -151 331 -204 520
-139 78 28 85 29 123 15 118 -41 260 23 382 173 112 140 150 272 128 448 -19
151 -75 283 -188 441 -86 122 -232 226 -373 268 -66 19 -177 20 -248 1z"
							/>
						</g>
					</svg>
				</div>
			{/if}
		</div>
		<div class="add-meme">
			<a
				on:click={() => {
					add_mode = true;
					positionBubbleUp();
				}}
			>
				<img src="/icons/svgs/addWithOutBorder.svg" height="40" />
			</a>
		</div>
	</div>
{:else}
	<div class="show-memes" transition:slide|local={{ delay: 200, duration: 400, easing: quintOut }}>
		{#each memes as meme}
			<div class="rest-meme">
				<img src="/icons/svgs/star.svg" height="100%" />
			</div>
		{:else}
			<div class="no-meme-placeholder">
				<h3>Add a first meme!</h3>
			</div>
		{/each}
		<div class="add-meme-in-show-meme">
			<a href="/memehouse/mint">
				<img src="/icons/svgs/addWithOutBorder.svg" height="30" />
			</a>
			<a>
				<img src="/icons/svgs/more.svg" height="30" />
			</a>
		</div>
	</div>
{/if}

<style>
	.home-container {
		width: 100%;
		min-height: 170vw;
		background-color: whitesmoke;
		padding: 0;
		margin: 0;
	}

	.blog-header {
		width: 100%;
		height: 20vw;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0;
		margin: 0;
		background-color: white;
		position: relative;
	}

	.bloggers {
		width: 100px;
		height: 95%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		margin: 0;
		padding: 0;
		z-index: 3;
	}

	.blogger {
		width: 48px;
		height: 48px;
		border-radius: 24px;
		background-color: whitesmoke;
		margin: 0;
		padding: 0;
	}

	.blogger-default {
		position: relative;
		z-index: 3;
	}

	.blogger-company-1 {
		position: absolute;
		left: 40px;
		z-index: 2;
	}

	.blogger-company-2 {
		position: absolute;
		z-index: 1;
		left: 60px;
	}

	.title-date-dm-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 260px;
		height: 100%;
	}

	.title-date-wrap {
		width: 75%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	.dm-wrap {
		width: 25%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: end;
	}

	.blog {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100vw;
		background-color: transparent;
	}

	.memes {
		width: 100%;
		min-height: 50vw;
		display: grid;
		grid-template-columns: 25vw 25vw 25vw 25vw;
		grid-template-rows: 25vw 25vw;
	}

	.show-memes {
		width: 100%;
		height: fit-content;
		display: grid;
		grid-template-columns: 50vw 50vw;
	}

	.rest-meme {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50vw;
		width: 50vw;
		margin: 0;
		padding: 0;
	}

	.first-meme {
		grid-column: 1 / 3;
		grid-row: 1 / 3;
		position: relative;
	}

	.second-meme {
		grid-column: 3 / 4;
		grid-row: 1 / 2;
		position: relative;
	}

	.third-meme {
		grid-column: 4 / 5;
		grid-row: 1 / 2;
		position: relative;
	}

	.forth-meme {
		gird-column: 3 / 4;
		grid-row: 2 / 3;
		position: relative;
	}

	.add-meme {
		grid-column: 4 / 5;
		grid-row: 2 / 3;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.add-meme-in-show-meme {
		width: 50vw;
		height: 50vw;
		margin: 0;
		padding: 0;
		justify-content: space-around;
		align-items: center;
		display: flex;
		flex-direction: row;
	}

	.sample {
		height: 100%;
		width: 100%;
	}

	.title-wrap {
		width: 100%;
		height: 75%;
		font-family: popRegular;
		margin: 0;
		padding: 0;
		position: relative;
	}

	.title-container-long {
		margin: 0;
		padding: 0;
		align-items: center;
		display: flex;
		font-size: 14px;
		text-align: center;
		height: 100%;
		width: 100%;
		margin-top: 5px;
	}

	.title-container-short {
	}

	.date-wrap {
		width: 100%;
		height: 25%;
		font-size: 11px;
		text-align: end;
		color: #8c8c8c;
	}

	.extended-title {
		position: absolute;
		width: 100vw;
		height: 100%;
		background-color: #242424;
		top: 20vw;
		z-index: 6;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.title {
		width: fit-content;
		height: fit-content;
		text-align: center;
		justify-content: center;
		font-size: 15px;
		font-family: popRegular;
		color: whitesmoke;
	}

	.meme {
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: rgba(36, 36, 36, 0.3);
		position: absolute;
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
		top: 0;
	}
</style>
