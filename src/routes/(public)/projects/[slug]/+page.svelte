<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { i18n } from '#lib/i18n/index.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const statusLabel = $derived.by(() => {
		switch (data.project.status) {
			case 'live':
				return i18n.t.projects.statusLive;
			case 'in_progress':
				return i18n.t.projects.statusWip;
			default:
				return i18n.t.projects.statusArchived;
		}
	});

	const statusColor = $derived.by(() => {
		switch (data.project.status) {
			case 'live':
				return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800';
			case 'in_progress':
				return 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800';
			default:
				return 'text-neutral-700 bg-neutral-100 border-neutral-200 dark:text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800';
		}
	});
</script>

<svelte:head>
	<title>{data.project.title} — Case Study | Kantz</title>
	<meta name="description" content={data.project.tagline} />
</svelte:head>

<article class="mx-auto max-w-4xl px-4 py-16 sm:px-6">
	<!-- Top Navigation -->
	<div class="flex items-center justify-between border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
		<a
			href={resolve('/(public)/projects')}
			class="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
		>
			<Icon icon="solar:arrow-left-bold-duotone" class="size-3.5" />
			<span>{i18n.t.common.back}</span>
		</a>

		<div class="flex items-center gap-2">
			<span class="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-mono font-medium text-neutral-700 uppercase tracking-wider dark:bg-neutral-800 dark:text-neutral-300">
				{data.project.category}
			</span>
			<span class={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
				<span class="size-1.5 rounded-full bg-current"></span>
				<span>{statusLabel}</span>
			</span>
		</div>
	</div>

	<!-- Header Content -->
	<header class="mt-8">
		<h1 class="font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-white">
			{data.project.title}
		</h1>
		<p class="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
			{data.project.tagline}
		</p>

		<!-- Action Links -->
		<div class="mt-6 flex flex-wrap items-center gap-3">
			{#if data.project.liveUrl}
				<a
					href={data.project.liveUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
				>
					<Icon icon="solar:arrow-right-up-bold-duotone" class="size-4" />
					<span>{i18n.t.projects.liveDemo}</span>
				</a>
			{/if}

			{#if data.project.githubUrl}
				<a
					href={data.project.githubUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-xs transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
				>
					<Icon icon="solar:code-file-bold-duotone" class="size-4" />
					<span>{i18n.t.projects.sourceCode}</span>
				</a>
			{/if}
		</div>

		<!-- Technologies Matrix -->
		{#if data.project.technologies && data.project.technologies.length > 0}
			<div class="mt-8 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
				<span class="text-xs font-mono uppercase text-neutral-500">Core Technologies:</span>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each data.project.technologies as tech (tech)}
						<span class="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-mono text-neutral-700 shadow-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
							{tech}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.project.images && data.project.images.length > 0}
			<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{#each data.project.images as imgUrl, idx (imgUrl)}
					<div class="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
						<img
							src={imgUrl}
							alt={`${data.project.title} screenshot ${idx + 1}`}
							loading="lazy"
							decoding="async"
							class="aspect-video w-full object-cover transition-transform duration-300 hover:scale-105"
						/>
					</div>
				{/each}
			</div>
		{/if}
	</header>

	<!-- Technical Case Study Content -->
	<section class="mt-12 border-t border-neutral-200/80 pt-8 dark:border-neutral-800/80">
		<div class="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 space-y-4">
			{#each data.project.description.split('\n\n') as paragraph, pIdx (pIdx)}
				{#if paragraph.startsWith('### ')}
					<h2 class="font-display text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-3">
						{paragraph.replace('### ', '')}
					</h2>
				{:else if paragraph.startsWith('- ')}
					<ul class="list-disc pl-5 space-y-1.5 text-sm leading-relaxed">
						{#each paragraph.split('\n') as item, iIdx (iIdx)}
							<li>{item.replace('- ', '')}</li>
						{/each}
					</ul>
				{:else}
					<p class="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
						{paragraph}
					</p>
				{/if}
			{/each}
		</div>
	</section>

	<!-- Next / Previous Navigation -->
	<nav aria-label="Project Navigation" class="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-200/80 pt-8 dark:border-neutral-800/80">
		{#if data.prevProject}
			<a
				href={resolve('/(public)/projects/[slug]', { slug: data.prevProject.slug })}
				class="flex flex-col rounded-xl border border-neutral-200 p-4 transition-all hover:border-neutral-300 hover:shadow-xs dark:border-neutral-800 dark:hover:border-neutral-700"
			>
				<span class="inline-flex items-center gap-1 text-xs font-mono text-neutral-500">
					<Icon icon="solar:arrow-left-bold-duotone" class="size-3.5" />
					<span>Previous Project</span>
				</span>
				<span class="mt-1 font-display text-base font-semibold text-neutral-900 dark:text-white">
					{data.prevProject.title}
				</span>
			</a>
		{:else}
			<div></div>
		{/if}

		{#if data.nextProject}
			<a
				href={resolve('/(public)/projects/[slug]', { slug: data.nextProject.slug })}
				class="flex flex-col sm:items-end rounded-xl border border-neutral-200 p-4 transition-all hover:border-neutral-300 hover:shadow-xs dark:border-neutral-800 dark:hover:border-neutral-700 text-left sm:text-right"
			>
				<span class="inline-flex items-center gap-1 text-xs font-mono text-neutral-500">
					<span>Next Project</span>
					<Icon icon="solar:arrow-right-bold-duotone" class="size-3.5" />
				</span>
				<span class="mt-1 font-display text-base font-semibold text-neutral-900 dark:text-white">
					{data.nextProject.title}
				</span>
			</a>
		{/if}
	</nav>
</article>

<Footer />
