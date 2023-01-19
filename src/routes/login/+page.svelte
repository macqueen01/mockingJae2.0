<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { scrolls } from '$lib/routes';
	import{ goto }from '$app/navigation'; 

	var dispatch = createEventDispatcher();

	let email = '';
	let password = '';

	onMount(() => {
		scrolls.update(() => false);

		document.documentElement.style.setProperty('--mkj-background-color', `#59545f`);
	})


	function switchToSignIn() {
		goto("/signin");
	}


</script>

<div class="wrapper">
	<div class="content-wrap" in:fade={{ delay: 300, duration: 400, opacity: 0 }}>
		<div class="login-container">
			<div class="login-wrap">
				<div class="login">
					<div class="login-title">
						<img src="/icons/svgs/Jae.svg" height="55" />
					</div>
					<div class="login-form">
						<form action="/login" method="POST">
							<div class="login-input">
								<label
									for="username"
									class={email.length == 0 ? 'username-label' : 'username-label-filled'}
									>Your email</label
								>
								<input
									class="email-input"
									type="text"
									name="username"
									required
									bind:value={email}
								/>
								<img src="/icons/crop_bar.png" height="4" width="200" />
							</div>
							<div class="login-input">
								<label
									for="password"
									class={password.length == 0 ? 'password-label' : 'password-label-filled'}
									>Password</label
								>
								<input
									class="password-input"
									type="password"
									name="password"
									required
									bind:value={password}
								/>
								<img src="/icons/crop_bar.png" height="4" width="200" />
							</div>
							<div class="actions">
								<div class="login-button-wrap">
									<button class="login-button" type="submit" />
								</div>
								<div class="or">
									<hr class="first" />
									<p class="middle">OR</p>
									<hr class="second" />
								</div>
								<div class="signin-button-wrap">
									<button class="signin-button" on:click={switchToSignIn} />
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.content-wrap {
		width: 300px;
		height: 500px;
		border-radius: 14px;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
		background-color: white;
		margin: 0;
		padding: 0;
	}

	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
	}

	.login-title {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		margin: 0;
		padding: 0;
		padding-top: 65px;
		margin-bottom: 30px;
	}

	/* style of login form. sections login-wrap and login-form with subtle line */
	.login-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
	}

	.login {
		width: 100%;
		height: 100%;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 65%;
		margin: 0;
		padding: 0;
	}

	.login-input {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: fit-content;
		justify-content: center;
		align-items: center;
		padding: 0;
		margin: 0;
		margin-bottom: 30px;
		position: relative;
	}

	.actions {
		width: 100%;
		height: 60%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
	}

	.login-button-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.or {
		width: 100%;
		padding-top: 5px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding-bottom: 8px;
	}

	.first,
	.second {
		width: 30%;
		margin: auto;
		padding: auto;
		height: 2px;
		border-width: 0;
		color: gray;
		background-color: gray;
	}

	.middle {
		display: flex;
		justify-content: center;
		font-family: popRegular;
		letter-spacing: 6.5px;
		font-size: 15px;
		color: gray;
		text-align: center;
	}

	.signin-button-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.login-button {
		background-image: url('/icons/svgs/loginBox.svg');
		background-size: cover;
		background-color: transparent;
		border: none;
		width: 120px;
		height: 40px;
	}

	.signin-button {
		background-image: url('/icons/svgs/signinBox.svg');
		background-size: cover;
		background-color: transparent;
		border: none;
		width: 120px;
		height: 40px;
	}

	button:active {
		background-color: transparent;
		border: none;
	}

	.email-input {
		margin: 0;
		border: none;
		outline: none;
		background: transparent;
		font-size: 15px;
		z-index: 3;
	}

	.password-input {
		margin: 0;
		border: none;
		outline: none;
		background: transparent;
		font-size: 15px;
		z-index: 3;
	}

	.username-label,
	.password-label {
		width: 100%;
		height: fit-content;
		font-size: 15px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: absolute;
		top: 6px;
		left: 7px;
		-webkit-transition: all 0.3s cubic-bezier(1, 0.03, 0, 0.97);
		color: gray;
	}

	.username-label-filled,
	.password-label-filled {
		width: 100%;
		height: fit-content;
		font-size: 12px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: absolute;
		top: -13px;
		left: -2px;
		-webkit-transition: all 0.3s cubic-bezier(1, 0.03, 0, 0.97);
	}

	.login-input:focus-within label {
		top: -13px;
		left: -2px;
		font-size: 12px;
	}
</style>
