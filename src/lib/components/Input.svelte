<script lang="ts">
	import { connectWallet } from '$lib/utils/wallet';
	import Copy from './Copy.svelte';
	import Error from './Error.svelte';

	let { onjoin } = $props();

	let name = $state('');
	let username = $state('');
	let about = $state('');
	let userAddress: string = $state('');

	let aboutLength = $derived(about.length);

	let isAvailable: boolean | null = $state(null);

	let error = $state('');

	async function handleConnect() {
		try {
			const wallet = await connectWallet();
			userAddress = wallet.address;
		} catch (error: any) {
			error = error.message;
		}
	}

	async function checkUsernameAvailable() {
		if (!username.trim()) {
			isAvailable = null;
			return;
		}

		const res = await fetch('/api/check-username', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username.trim().toLowerCase() })
		});

		const data = await res.json();
		isAvailable = data.available;
	}

	async function handleGenerate() {
		await checkUsernameAvailable();

		if (about.length > 100) {
			error = 'About must be less than 100 chars.';
			return;
		}

		if (!name || !username || !about || !isAvailable) {
			return;
		}

		if (!userAddress) {
			error = 'Please connect your wallet.';
			return;
		}

		const res = await fetch('/api/insert-user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, name, about, userAddress })
		});

		const result = await res.json();

		if (result.success) {
			onjoin(username);
		} else {
			error = 'Something went wrong.';
		}
	}

	$effect(() => {
		if (error) {
			setTimeout(() => {
				error = '';
			}, 5000);
		}
	});
</script>

<div
	class="w-[90%] rounded-3xl border border-gray-700 bg-white p-7 md:w-[75%] md:p-10 lg:w-[60%] xl:w-[35%]"
>
	<img src="/images/logo.png" alt="log" height="100px" width="100px" class="mx-auto" />

	<div class="mb-6 space-y-2 text-center">
		<p class="text-2xl font-bold">Welcom to Dotme</p>
		<p class="text-lg">Give your supporter a way to say thank you.</p>
	</div>

	<form onsubmit={handleGenerate} class="flex flex-col gap-4">
		<div class="flex flex-col md:mb-2">
			<label for="name" class="mb-2 font-semibold">Name</label>
			<input
				type="text"
				id="name"
				placeholder="Your Name"
				class="rounded-lg px-4 py-2"
				required
				bind:value={name}
			/>
		</div>

		<div class="flex flex-col md:mb-2">
			<label for="username" class="mb-2 font-semibold">Username</label>
			<div class="mb-2">
				<input
					type="text"
					id="username"
					placeholder="username"
					class="w-[70%] rounded-lg px-4 py-2"
					required
					value={username}
					oninput={(e) => {
						username = e.currentTarget.value.toLowerCase();
					}}
				/>
				<button
					class="w-[28%] cursor-pointer rounded-lg bg-yellow-300 py-2 font-semibold transition duration-300 hover:bg-yellow-400 active:scale-95"
					type="button"
					onclick={checkUsernameAvailable}>Check</button
				>
			</div>
			{#if isAvailable === false}
				<p class="text-sm text-red-500">Username is not available.</p>
			{:else if isAvailable === true}
				<p class="text-sm text-green-500">Username is available.</p>
			{/if}
		</div>

		<div class="relative flex flex-col md:mb-2">
			<label for="about" class="mb-2 font-semibold">About</label>
			<textarea
				id="about"
				placeholder="About yourself"
				class="h-24 rounded-2xl px-4 py-4"
				required
				bind:value={about}
			>
			</textarea>
			<span class="absolute right-2 bottom-2">{aboutLength}/100</span>
		</div>

		<div class="mb-4">
			{#if userAddress}
				<Copy data={userAddress} />
			{:else}
				<button
					class="w-full cursor-pointer rounded-full bg-yellow-300 p-2 font-bold text-black transition duration-300 hover:bg-yellow-400 active:scale-95"
					onclick={handleConnect}
					type="button">Connect Wallet</button
				>
			{/if}
		</div>
		<button
			type="submit"
			class="cursor-pointer rounded-full bg-black p-2 text-white transition duration-300 hover:bg-gray-800 active:scale-95"
			>Generate</button
		>
		<p class="text-center text-xs text-gray-500">
			By clicking Generate, you agree to our <span class="border-b-1 border-gray-500"
				>Terms of Service</span
			>
			and
			<span class="border-b-1 border-gray-500">Privacy Policy</span>.
		</p>
	</form>
</div>

{#if error}
	<Error {error} />
{/if}
