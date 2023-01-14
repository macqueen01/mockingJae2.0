<script>
	export let stage = 0;
	export let title;

	import { createEventDispatcher } from 'svelte';

	var dispatch = createEventDispatcher();

	function bubbleUpTitle() {
		console.log('bubble up title...');
		stage += 1;
		dispatch('postTitle', {
			title: title,
			stage: stage
		});
	}

	let title_rule_detail = {
		is_short_enough: true
	};

	let title_rule_result = false;

	function title_rule(title) {
		let max_len = 40;
		let title_len = title.length;
		let detail = {};
		detail.is_short_enough = title_len <= max_len;
		title_rule_detail = detail;
		console.log(title);
	}

	$: {
		title_rule(title);
		title_rule_result = title_rule_detail.is_short_enough;
	}

	function goBack() {
		stage -= 1;
		dispatch('postTitle', {
			title: title,
			stage: stage
		});
	}
</script>

<div class="set-post-title-wrap">
	<div class="container">
		<div class="questionair-container">
			{#if title_rule_result}
				<h2>Now it deserves a good title</h2>
			{:else}
				<h2>Too long for a meme...</h2>
			{/if}
		</div>

		<div class="form-wrap">
			<div class="field-wrap">
				<input id="title" name="title" class="title-field" bind:value={title} />
			</div>
			<img src="/icons/crop_bar.png" height="4" width="200" />
		</div>
		<div class="title-requirement-container">
			{#if !title_rule_detail.is_short_enough}
				<div class="requirement-wrap">
					<div class="icon-wrap">
						<img src="/icons/svgs/cross.svg" width="13px" height="13px" />
					</div>
					<p>Too long! Make it shorter than 35 letters including whitespace.</p>
				</div>
			{/if}
			{#if title_rule_result}
				<div class="requirement-wrap-check">
					<div class="icon-wrap">
						<img src="/icons/svgs/check.svg" width="13px" height="13px" />
					</div>
					<p>Good to go!</p>
				</div>
			{/if}
		</div>
	</div>
</div>
<div class="sub-navbar-wrap">
	<div class="sub-navbar-left">
		{#if stage != 0}
			<button class="nav-left" on:click={goBack} />
		{/if}
	</div>
	<div class="sub-navbar-right">
		{#if stage == 1 && title_rule_result}
			<button class="nav-right" on:click={bubbleUpTitle} />
		{/if}
	</div>
</div>

<style>
	.set-post-title-wrap {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		height: 80%;
		margin: 0;
		padding: 0;
	}

	.sub-navbar-wrap {
		width: 100%;
		height: 20%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.sub-navbar-left {
		width: 30%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.sub-navbar-right {
		transform: scaleX(-1);
		width: 30%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.nav-left,
	.nav-right {
		background-image: url('/icons/svgs/arrowToLeft.svg');
		background-size: cover;
		background-color: transparent;
		border: none;
		height: 50px;
		width: 50px;
	}

	.nav-left:active,
	.nav-right:active {
		background-color: transparent;
		border: none;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.title-field,
	.title-field:focus {
		background-color: transparent;
		border: none;
		outline: none;
	}

	.field-wrap {
		width: fit-content;
		height: fit-content;
		display: flex hidden;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
		background-color: transparent;
	}

	.form-wrap {
		width: fit-content;
		height: 30%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.questionair-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		width: 65%;
		height: 40%;
		font-size: 20px;
		text-align: center;
	}

	.title-field {
		display: hidden;
		text-align: center;
		padding: 0;
		margin: 0;
		padding-bottom: 3px;
		font-size: 20px;
		font-family: popRegular;
	}

	.title-requirement-container {
		width: 60%;
		height: 150px;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	p {
		font-family: popRegular;
		font-size: 12px;
		padding: 0;
		margin: 0;
		padding-left: 3px;
		padding-bottom: 20px;
	}

	:global(h1) {
		font-family: popRegular;
		font-size: 25px;
		color: gray;
	}

	:global(h2) {
		font-family: popRegular;
		font-size: 20px;
	}

	.requirement-wrap {
		width: 100%;
		height: fit-content;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		color: red;
	}

	.icon-wrap {
		height: 100%;
		width: fit-content;
		padding-right: 5px;
	}

	.requirement-wrap-check {
		width: 100%;
		height: fit-content;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		color: #3acc37;
	}
</style>
