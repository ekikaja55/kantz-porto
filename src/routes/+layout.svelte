<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	$effect(() => {
		document.body.dataset.hydrated = 'true';
	});
</script>

<ModeWatcher defaultMode="system" />

{@render children()}
