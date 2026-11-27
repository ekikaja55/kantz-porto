<script lang="ts">
	import { page } from '$app/state';
	import Shell from '#lib/components/terminal/Shell.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	let canonicalUrl = $derived(`${page.url.origin}${page.url.pathname}`);
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="kantZ Workstation" />
</svelte:head>

<Shell>
	{@render children()}
</Shell>
