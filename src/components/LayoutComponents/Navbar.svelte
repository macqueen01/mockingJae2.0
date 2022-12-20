<script>
	import { scrolls } from "$lib/routes";
	import { loggedIn } from "$lib/states";

	let navscrolls = false;

	$: {
		navscrolls = $scrolls;
	}
</script>

<div class="navbar" class:navscrolls>
	<div class="nav-content-wrap">
		<a class="logo-wrap" href="/login">
			{#if !$loggedIn}
				<img src="/icons/svgs/Me.svg" height="30" alt="JAE" />
			{:else}
				<img src="/icons/svgs/Jae_footer.svg" height="27" alt="JAE" />
			{/if}
		</a>
		<div class="menu-wrap">
			{#if !$loggedIn}
				<a class="home-wrap" href="/memehouse">
					<img src="/icons/svgs/Home.svg" height="28" alt="home" />
				</a>
				<a class="global-wrap" href="/memehouse">
					<img src="/icons/svgs/Global.svg" height="28" alt="global" />
				</a>
			{/if}
			<a class="dm-wrap" href="/memehouse">
				<img src="/icons/svgs/Dm.svg" height="28" alt="dm" />
			</a>
		</div>
	</div>
</div>

<style>
	.navbar {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		border-bottom: solid #59545f;
		border-width: 2px;
		height: 50px;
		width: 100%;
		background-color: #59545f;
		z-index: 10;
		transition: all 0.3s;
	}

	.nav-content-wrap {
		display: flex;
		width: 100%;
		height: 100%;
		padding-left: 20px;
		padding-right: 15px;
		padding-top: 4px;
	}

	.logo-wrap {
		box-sizing: fit-content;
		width: fit-content;
		align-items: center;
		text-align: center;
		margin-top: auto;
		margin-bottom: auto;
	}

	.menu-wrap {
		display: inline-flex;
		height: fit-content;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin-top: auto;
		margin-bottom: auto;
		gap: 10px;
	}

	.navscrolls {
		background: transparent;
		border-bottom: none;
	}
</style>
