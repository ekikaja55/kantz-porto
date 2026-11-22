<script lang="ts">
	import Navbar from '#lib/components/Navbar.svelte';
	import MobileNavDock from '#lib/components/MobileNavDock.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div class="flex min-h-screen flex-col font-sans">
	<Navbar />
	<main class="flex-1 pb-16 md:pb-0">
		{@render children()}
	</main>
	<MobileNavDock />
</div>
