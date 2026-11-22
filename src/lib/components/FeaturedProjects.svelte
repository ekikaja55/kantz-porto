<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { i18n } from '#lib/i18n/index.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import type { Project } from '#lib/server/db/schema';

	interface Props {
		projects: Project[];
	}

	let { projects }: Props = $props();
</script>

<section id="projects" class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
	<div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
		<div>
			<h2 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
				{i18n.t.projects.title}
			</h2>
			<p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
				{i18n.t.projects.subtitle}
			</p>
		</div>

		<a
			href={resolve('/(public)/projects')}
			class="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:underline dark:text-white"
		>
			<span>{i18n.t.common.viewAll}</span>
			<Icon icon="solar:arrow-right-bold-duotone" class="size-4" />
		</a>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each projects as project (project.id)}
			<ProjectCard {project} isFeatured={true} />
		{/each}
	</div>
</section>
