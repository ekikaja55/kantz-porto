<script lang="ts">
	import type { Snippet } from 'svelte';
	import NavigationProgress from '#lib/components/NavigationProgress.svelte';
	import ToastContainer from '#lib/components/ToastContainer.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<NavigationProgress />
<ToastContainer />
{@render children()}
