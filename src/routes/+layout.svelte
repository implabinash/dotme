<script lang="ts">
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.css';

	let { children } = $props();

	injectAnalytics();
</script>

<div class="app">
	<main>
		{@render children()}
	</main>
</div>
