<script lang="ts">
	import { page } from '$app/state';
	import OutputBlock from '#lib/components/terminal/OutputBlock.svelte';
	import Panel from '#lib/components/terminal/Panel.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const description =
		'Technical skills, languages, frameworks, databases, and system tools utilized by Rizki Arkant Pratama (Kantz).';

	const CATEGORY_META = [
		{ name: 'languages', colorVar: 'var(--t-accent)', titleClass: 'text-term-accent' },
		{ name: 'frameworks', colorVar: 'var(--t-info)', titleClass: 'text-term-info' },
		{ name: 'databases', colorVar: 'var(--t-ok)', titleClass: 'text-term-ok' },
		{ name: 'systems', colorVar: 'var(--t-special)', titleClass: 'text-term-special' }
	] as const;

	let groupedSkills = $derived(
		CATEGORY_META.map((meta) => ({
			...meta,
			items: data.skills.filter((s) => s.category.toLowerCase() === meta.name)
		})).filter((group) => group.items.length > 0)
	);
</script>

<svelte:head>
	<title>skills | kantZ Workstation</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="skills | kantZ Workstation" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{page.url.origin}/og-default.png" />
</svelte:head>

<OutputBlock command="skills">
	<h1 class="sr-only">skills</h1>

	{#if groupedSkills.length === 0}
		<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-muted py-2">
			no skills recorded yet
		</p>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
			{#each groupedSkills as group, idx (group.name)}
				<Panel
					title={group.name}
					titleClass={group.titleClass}
					style="--cat-color: {group.colorVar}; --stagger: {idx};"
					class="term-cat-panel term-stagger mb-0"
				>
					<div class="flex flex-wrap gap-2">
						{#each group.items as skill (skill.id)}
							<span
								class="term-skill-chip inline-block border px-2.5 py-1 font-term-mono text-[15px] md:text-[16px] leading-[1.4] text-term-fg"
							>
								{skill.name}
							</span>
						{/each}
					</div>
				</Panel>
			{/each}
		</div>
	{/if}
</OutputBlock>
