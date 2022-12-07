<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	import SetTitle from '$lib/Forms/PostComponents/SetTitle.svelte';
	import SetFile from '$lib/Forms/PostComponents/SetFile.svelte';

	let _title = '';
	let _file = '';
	let _created_at = '';
	let _crafter = '';
	let is_local = false;

	var dispatch = createEventDispatcher();

	//stage starts from 0 to 3 where stage 3 sends POST request
	//to the server with the info gathered through stage 0 to 2.
	//initialized at stage 0.
	$: stage = 0;

	function resetTitle(e) {
		_title = e.detail.title;
		stage = e.detail.stage;
		console.log('title reset:', _title);
	}

	function resetFile(e) {
		// if is_local is true, file recieved comes from Jae service.
		_file = e.detail.file;
		stage = e.detail.stage;
		is_local = e.detail.is_local;
		console.log('file reset:', _file, 'on local:', is_local);
	}

	$: {
		if (stage == 3) {
			setTimeout(() => {
				dispatch('mode', {
					signIn: false
				});
			}, 5000);
		}
	}
</script>

<div class="wrapper">
	<div class="content-wrap" in:fade={{ delay: 300, duration: 400, opacity: 0 }}>
		<div class="posting-container">
			{#if stage == 0}
				<SetFile on:postFile={resetFile} file={_file} {stage} {is_local} />
			{:else if stage == 1}
				<SetTitle on:postTitle={resetTitle} title={_title} {stage} />
			{:else if stage == 2}
				<h3>WELCOME TO</h3>
				<img src="/icons/svgs/Jae.svg" height="60" />
			{/if}
		</div>
	</div>
</div>

<style>
	.content-wrap {
		width: 300px;
		height: 500px;
		border-radius: 2px;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
		background-color: white;
		margin: 0;
		padding: 0;
	}

	/* style of login continer. centers all items inside */
	.posting-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: space-between;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		position: relative;
	}

	h3 {
		font-family: popLight;
		font-size: 25px;
		padding: 0;
		margin: 0;
		margin-bottom: 10px;
	}
</style>
