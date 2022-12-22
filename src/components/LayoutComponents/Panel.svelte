<script>
	import { scrolls } from '$lib/routes';
	import HomeIcon from '$lib/Icons/HomeIcon.svelte';
	import AddIcon from '$lib/Icons/AddIcon.svelte';
	import GlobalIcon from '$lib/Icons/GlobalIcon.svelte';
	import LockedIcon from '$lib/Icons/LockedIcon.svelte';

	let panelscrolls = false;

	$: {
		panelscrolls = $scrolls;
	}
</script>

<div class="panel-container" class:panelscrolls>
	<div class="panel-wrap">
		<a>
			<HomeIcon size={28} color={panelscrolls ? '#f5f5f5' : '#59545f'} />
		</a>
		<a>
			<AddIcon size={28} color={panelscrolls ? '#f5f5f5' : '#59545f'} />
		</a>
		<a>
			<GlobalIcon size={28} color={panelscrolls ? '#f5f5f5' : '#59545f'} />
		</a>
		<a>
			<LockedIcon size={28} color={panelscrolls ? '#f5f5f5' : '#59545f'} />
		</a>
	</div>
</div>

<style>
	.panel-container {
		display: flex;
		position: fixed;
		z-index: 40;
		bottom: -45px;
		left: 0;
		right: 0;
		width: 100%;
		height: 110px;
		border-top: solid #ebe5d1;
		border-width: 2px;
		background-color: #fef7dc;
		justify-content: center;
	}

	.panelscrolls {
		background: transparent;
		border: none;
	}

	.panel-wrap {
		width: 100%;
		height: 30%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin: 0;
		padding: 0;
		padding-top: 10px;
	}
</style>
