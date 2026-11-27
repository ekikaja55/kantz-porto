<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import OutputBlock from '#lib/components/terminal/OutputBlock.svelte';
	import ErrorBlock from '#lib/components/terminal/ErrorBlock.svelte';
	import { COMMAND_REGISTRY, suggestCommands } from '#lib/terminal/commands';

	let status = $derived(page.status);
	let isNotFound = $derived(status === 404);
	let pathname = $derived(page.url.pathname);

	let message = $derived.by(() => {
		if (isNotFound) {
			return page.error?.message || `command not found: ${pathname}`;
		}
		return `error ${status}: ${page.error?.message || 'internal server error'}`;
	});

	let suggestions = $derived.by(() => {
		if (!isNotFound) return [];
		const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
		const navCommands = COMMAND_REGISTRY.filter((c) => c.kind === 'nav' && c.id !== 'sudo');
		const matched = suggestCommands(firstSegment, navCommands, 3);
		return matched.length > 0 ? matched : ['about_me', 'projects', 'skills'];
	});
</script>

<svelte:head>
	<title>{status} | kantZ Workstation</title>
	<meta name="description" content="Error {status} on kantZ Workstation." />
</svelte:head>

<OutputBlock command={isNotFound ? pathname : `status ${status}`}>
	<h1 class="sr-only">Error {status}</h1>

	<ErrorBlock
		input={pathname}
		{message}
		{suggestions}
		hint={isNotFound ? 'type help for the list' : ''}
	/>

	<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55]">
		<a href={resolve('/(public)')} class="text-term-info underline hover:text-term-accent">
			return to about_me
		</a>
	</p>
</OutputBlock>
