<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import NavigationProgress from '#lib/components/NavigationProgress.svelte';
	import ToastContainer from '#lib/components/ToastContainer.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	$effect(() => {
		document.body.dataset.hydrated = 'true';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="system" />
<NavigationProgress />
<ToastContainer />

{@render children()}
