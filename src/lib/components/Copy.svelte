<script lang="ts">
	import { Copy, CheckCheck } from '@lucide/svelte';
	import Error from './Error.svelte';

	let { data } = $props();

	let isCopied = $state(false);
	let error = $state('');

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(data);
			isCopied = true;
			setTimeout(() => (isCopied = false), 1500);
		} catch (err) {
			error = 'Copy failed: ' + err;
		}
	}
</script>

<div
	class="flex w-full items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 font-bold text-black"
>
	<span class="w-[90%] overflow-hidden">{data}</span>

	<button
		class="cursor-pointer text-black transition duration-300 hover:text-gray-500 active:rotate-45"
		onclick={copyToClipboard}
		title="Copy to clipboard"
		type="button"
	>
		{#if isCopied}
			<CheckCheck />
		{:else}
			<Copy />
		{/if}
	</button>
</div>

{#if error}
	<Error {error} />
{/if}
