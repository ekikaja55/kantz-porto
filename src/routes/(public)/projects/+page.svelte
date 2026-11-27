<script lang="ts">
	import { page } from '$app/state';
	import OutputBlock from '#lib/components/terminal/OutputBlock.svelte';
	import TreeList from '#lib/components/terminal/TreeList.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const description =
		'Software engineering projects, architectural case studies, and systems developed by Rizki Arkant Pratama (Kantz).';
</script>

<svelte:head>
	<title>projects | kantZ Workstation</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="projects | kantZ Workstation" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{page.url.origin}/og-default.png" />
</svelte:head>

<OutputBlock command="projects">
	<h1 class="sr-only">projects</h1>

	<TreeList projects={data.projects} />
</OutputBlock>
