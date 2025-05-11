<script lang="ts">
	import { onMount } from 'svelte';
	import Copy from './Copy.svelte';
	import { ApiPromise, WsProvider } from '@polkadot/api';
	import type { Signer } from '@polkadot/api/types';
	import { connectWallet, sendDot } from '$lib/utils/wallet';
	import Error from './Error.svelte';
	import Loader from './Loader.svelte';

	let { username, isPreview = false } = $props();

	let name = $state('');
	let about = $state('');
	let toAddress = $state('');
	let photoId = $state();
	let totalDotReceived: number = $state(0);

	let fromAddress: string = $state('');
	let error = $state('');
	let message = $state('');

	let api: ApiPromise | undefined = $state();
	let signer: Signer | undefined = $state();

	onMount(() => {
		(async () => {
			const res = await fetch('/api/get-user', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: username.trim().toLowerCase() })
			});

			const data = await res.json();

			name = data.user.name;
			about = data.user.about;
			toAddress = data.user.address;
			photoId = data.user.photo_id;
			totalDotReceived = +data.user.total_dot_received;
		})();

		(async () => {
			// wss://polkadot.dotters.network
			const wsProvider = new WsProvider('wss://westend.dotters.network');
			api = await ApiPromise.create({ provider: wsProvider });
		})();
	});

	async function handleConnect() {
		try {
			const wallet = await connectWallet();
			fromAddress = wallet.address;
			signer = wallet.signer;
		} catch (err: any) {
			error = err.message;
		}
	}

	async function updateDot(amount: number) {
		totalDotReceived += amount;

		const res = await fetch('/api/update-dot', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username.trim().toLowerCase(), totalDotReceived })
		});

		const data = await res.json();

		if (!data.success) {
			error = 'Something went wrong.';
		}
	}

	async function handleSend(amount: number) {
		try {
			const result = await sendDot(fromAddress, toAddress, amount, api, signer);
			message = result;

			await updateDot(amount);
		} catch (err) {
			error = 'Transaction failed: ' + err;
		}
	}

	$effect(() => {
		if (error || message) {
			setTimeout(() => {
				error = '';
				message = '';
			}, 5000);
		}
	});
</script>

<div
	class="mb-4 flex w-full flex-col items-center justify-center gap-5 rounded-3xl border border-gray-500 bg-white p-5 text-center md:p-10"
>
	{#if !name}
		<Loader />
	{:else}
		<div class="h-24 w-24 rounded-full border border-gray-700">
			<img src={`/images/${photoId}.webp`} alt="pfp" class="p-2.5" height="96px" width="96px" />
		</div>

		<h2 class="text-2xl font-bold">{name}</h2>

		<p class="mb-5">
			{about}
		</p>

		<div class="flex w-full flex-col gap-5 text-lg font-bold">
			{#if !isPreview && !fromAddress}
				<div>
					<button
						class="w-full cursor-pointer rounded-full bg-yellow-300 p-2 font-bold text-black transition duration-300 hover:bg-yellow-400 active:scale-95"
						onclick={handleConnect}
						type="button">Connect Wallet</button
					>
				</div>
			{:else}
				<div class="flex items-center justify-center gap-5">
					<button
						class="w-1/2 cursor-pointer rounded-full bg-yellow-300 py-7 transition duration-300 hover:bg-yellow-400 active:scale-95"
						onclick={() => {
							handleSend(1);
						}}>1 DOT</button
					>
					<button
						class="w-1/2 cursor-pointer rounded-full bg-yellow-300 py-7 transition duration-300 hover:bg-yellow-400 active:scale-95"
						onclick={() => {
							handleSend(5);
						}}>5 DOT</button
					>
				</div>
				<div class="flex items-center justify-center gap-5">
					<button
						class="w-1/2 cursor-pointer rounded-full bg-yellow-300 py-7 transition duration-300 hover:bg-yellow-400 active:scale-95"
						onclick={() => {
							handleSend(10);
						}}>10 DOT</button
					>
					<button
						class="w-1/2 cursor-pointer rounded-full bg-yellow-300 py-7 transition duration-300 hover:bg-yellow-400 active:scale-95"
						onclick={() => {
							handleSend(20);
						}}>20 DOT</button
					>
				</div>
			{/if}
		</div>

		<div class="mt-5 w-full text-left">
			<p>For custom amount:</p>
			<Copy data={toAddress} />
		</div>
	{/if}
</div>

{#if error || message}
	<Error {error} {message} />
{/if}
