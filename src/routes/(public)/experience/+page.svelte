<script lang="ts">
	import { page } from '$app/state';
	import OutputBlock from '#lib/components/terminal/OutputBlock.svelte';
	import LogTimeline from '#lib/components/terminal/LogTimeline.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const description =
		'Professional work history, engineering roles, and instructional experience of Rizki Arkant Pratama (Kantz).';
</script>

<svelte:head>
	<title>experience | kantZ Workstation</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="experience | kantZ Workstation" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{page.url.origin}/og-default.png" />
</svelte:head>

<OutputBlock command="experience">
	<h1 class="sr-only">experience</h1>

	<LogTimeline experiences={data.experiences} />
</OutputBlock>
