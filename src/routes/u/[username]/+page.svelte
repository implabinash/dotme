<script lang="ts">
	import { page } from '$app/state';
	import Pagenotfound from '$lib/components/Pagenotfound.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import { onMount } from 'svelte';

	let username = page.params.username;
	let isAvailable = $state();

	onMount(() => {
		(async () => {
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
		})();
	});
</script>

<svelte:head>
	<title>{username} | Dotme</title>
	<meta name="description" content={`Support ${username} by sending DOT directly.`} />
</svelte:head>

<main class="relative flex h-screen w-screen items-center justify-center bg-[#FCF8F1]">
	<div class="mx-auto h-full p-10 md:w-[70%] xl:w-[40%]">
		{#if !isAvailable}
			<Preview {username} />
		{:else}
			<Pagenotfound />
		{/if}
	</div>
</main>
