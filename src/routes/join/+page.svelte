<script lang="ts">
	import Copy from '$lib/components/Copy.svelte';
	import Input from '$lib/components/Input.svelte';
	import Preview from '$lib/components/Preview.svelte';

	let username = $state('');
	let isJoined = $state();

	let url = $derived(`https://dotme-two.vercel.app/u/${username}`);

	function setJoined(newUsername: string) {
		username = newUsername;
		isJoined = true;
	}
</script>

<svelte:head>
	<title>Join Dotme</title>
	<meta name="description" content="Join Dotme to receive tips in DOT" />
</svelte:head>

<main class="relative flex h-screen w-screen items-center justify-center bg-[#FCF8F1]">
	{#if !isJoined}
		<Input onjoin={setJoined} />
	{:else}
		<div class="h-full w-full p-7 md:w-[70%] xl:w-[40%]">
			<Preview {username} isPreview />
			<dir class="">
				<p class="mb-2 text-lg">Share your Dotme page on social media:</p>
				<Copy data={url} />
			</dir>
		</div>
	{/if}
</main>
