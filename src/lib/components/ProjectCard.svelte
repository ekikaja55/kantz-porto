<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { i18n } from '#lib/i18n/index.svelte';
	import type { Project } from '#lib/server/db/schema';

	interface Props {
		project: Project;
		isFeatured?: boolean;
	}

	let { project, isFeatured = false }: Props = $props();

	const statusLabel = $derived.by(() => {
		switch (project.status) {
			case 'live':
				return i18n.t.projects.statusLive;
			case 'in_progress':
				return i18n.t.projects.statusWip;
			default:
				return i18n.t.projects.statusArchived;
		}
	});

	const statusColor = $derived.by(() => {
		switch (project.status) {
			case 'live':
				return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800';
			case 'in_progress':
				return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800';
			default:
				return 'text-neutral-700 bg-neutral-100 border-neutral-200 dark:text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800';
		}
	});
</script>

<article
	class={`flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-6 shadow-xs transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800/90 dark:bg-neutral-900/60 dark:hover:border-neutral-700 ${
		isFeatured ? 'lg:p-8' : ''
	}`}
>
	<div>
		<div class="flex items-center justify-between gap-2">
			<span class="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-mono font-medium text-neutral-700 uppercase tracking-wider dark:bg-neutral-800 dark:text-neutral-300">
				{project.category}
			</span>

			<span class={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
				<span class="size-1.5 rounded-full bg-current"></span>
				<span>{statusLabel}</span>
			</span>
		</div>

		{#if (project.images && project.images.length > 0) || project.thumbnailUrl}
			{@const cover = project.thumbnailUrl || project.images[0]}
			<div class="mt-4 aspect-video overflow-hidden rounded-lg border border-neutral-200/80 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
				<img
					src={cover}
					alt={project.title}
					loading="lazy"
					decoding="async"
					class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
				/>
			</div>
		{/if}

		<h3 class="mt-4 font-display text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
			{project.title}
		</h3>

		<p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
			{project.tagline}
		</p>

		{#if project.technologies && project.technologies.length > 0}
			<div class="mt-4 flex flex-wrap gap-1.5">
				{#each project.technologies as tech (tech)}
					<span class="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-mono text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
						{tech}
					</span>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800/70">
		<a
			href={resolve('/(public)/projects/[slug]', { slug: project.slug })}
			class="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:underline dark:text-white"
		>
			<span>{i18n.t.projects.caseStudy}</span>
			<Icon icon="solar:arrow-right-bold-duotone" class="size-4" />
		</a>

		<div class="flex items-center gap-2">
			{#if project.githubUrl}
				<a
					href={project.githubUrl}
					target="_blank"
					rel="external noopener noreferrer"
					title={i18n.t.projects.sourceCode}
					aria-label={`${project.title} GitHub repository`}
					class="inline-flex items-center justify-center rounded-lg border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
				>
					<Icon icon="solar:code-file-bold-duotone" class="size-4" />
				</a>
			{/if}

			{#if project.liveUrl}
				<a
					href={project.liveUrl}
					target="_blank"
					rel="external noopener noreferrer"
					title={i18n.t.projects.liveDemo}
					aria-label={`${project.title} live demo`}
					class="inline-flex items-center justify-center rounded-lg border border-neutral-200 p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
				>
					<Icon icon="solar:arrow-right-up-bold-duotone" class="size-4" />
				</a>
			{/if}
		</div>
	</div>
</article>
