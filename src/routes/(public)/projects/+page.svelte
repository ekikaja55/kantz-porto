<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { i18n } from '#lib/i18n/index.svelte';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let searchQuery = $state('');
	let selectedCategory = $state('all');

	const categories = [
		{ id: 'all', label: 'All' },
		{ id: 'web', label: 'Web Apps' },
		{ id: 'mobile', label: 'Mobile & AI' },
		{ id: 'systems', label: 'Systems & Games' },
		{ id: 'tool', label: 'Tooling & Backend' }
	];

	const filteredProjects = $derived.by(() => {
		return data.projects.filter((project) => {
			const matchesCategory =
				selectedCategory === 'all' ||
				(selectedCategory === 'systems'
					? project.category === 'systems' || project.category === 'game'
					: project.category === selectedCategory);

			const query = searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				project.title.toLowerCase().includes(query) ||
				project.tagline.toLowerCase().includes(query) ||
				project.technologies.some((tech) => tech.toLowerCase().includes(query));

			return matchesCategory && matchesSearch;
		});
	});
</script>

<svelte:head>
	<title>{i18n.t.projects.title} — Kantz Portfolio</title>
	<meta
		name="description"
		content="Browse through the engineering project archive by Rizki Arkant Pratama (Kantz)."
	/>
</svelte:head>

<section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
	<div class="flex flex-col gap-2">
		<a
			href={resolve('/(public)')}
			class="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
		>
			<Icon icon="solar:arrow-left-bold-duotone" class="size-3.5" />
			<span>{i18n.t.common.back}</span>
		</a>

		<h1 class="font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
			{i18n.t.projects.title}
		</h1>
		<p class="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
			{i18n.t.projects.subtitle}
		</p>
	</div>

	<!-- Search & Filters Toolbar -->
	<div class="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
		<div class="relative w-full sm:max-w-xs">
			<Icon
				icon="solar:magnifer-bold-duotone"
				class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400"
			/>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search projects or stack..."
				class="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm text-neutral-900 placeholder-neutral-400 shadow-xs focus:border-neutral-400 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
			/>
		</div>

		<!-- Category Filter Chips -->
		<div class="flex flex-wrap gap-1.5">
			{#each categories as cat (cat.id)}
				<button
					type="button"
					onclick={() => (selectedCategory = cat.id)}
					class={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
						selectedCategory === cat.id
							? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
							: 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
					}`}
				>
					{cat.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Projects Grid -->
	{#if filteredProjects.length > 0}
		<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredProjects as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>
	{:else}
		<div class="mt-16 rounded-xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800">
			<Icon icon="solar:folder-with-files-bold-duotone" class="mx-auto size-8 text-neutral-400" />
			<p class="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
				{i18n.t.projects.emptyNotice}
			</p>
		</div>
	{/if}
</section>

<Footer />
