<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import OutputBlock from '#lib/components/terminal/OutputBlock.svelte';
	import KeyValue, { type KeyValueItem } from '#lib/components/terminal/KeyValue.svelte';
	import Tag from '#lib/components/terminal/Tag.svelte';
	import Markdown from '#lib/components/terminal/Markdown.svelte';
	import ImageViewer from '#lib/components/terminal/ImageViewer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function statusRole(status: string): 'ok' | 'warn' | 'muted' {
		const normalized = status.toLowerCase();
		if (normalized === 'live') return 'ok';
		if (normalized === 'wip' || normalized === 'in_progress' || normalized === 'in-progress') {
			return 'warn';
		}
		return 'muted';
	}

	function statusBorderClass(status: string): string {
		const role = statusRole(status);
		if (role === 'ok') return 'border-t-term-ok';
		if (role === 'warn') return 'border-t-term-warn';
		return 'border-t-term-accent';
	}

	function formatUrlLabel(url: string): string {
		return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
	}

	let linkItems = $derived<KeyValueItem[]>([
		...(data.project.liveUrl
			? [
					{
						key: 'live',
						value: formatUrlLabel(data.project.liveUrl),
						href: data.project.liveUrl,
						external: true
					}
				]
			: []),
		...(data.project.githubUrl
			? [
					{
						key: 'source',
						value: formatUrlLabel(data.project.githubUrl),
						href: data.project.githubUrl,
						external: true
					}
				]
			: [])
	]);
</script>

<svelte:head>
	<title>{data.project.title} | kantZ Workstation</title>
	<meta name="description" content={data.project.tagline} />
	<meta property="og:title" content="{data.project.title} | kantZ Workstation" />
	<meta property="og:description" content={data.project.tagline} />
	<meta
		property="og:image"
		content={data.project.thumbnailUrl || `${page.url.origin}/og-default.png`}
	/>
</svelte:head>

<OutputBlock command="open {data.project.slug}">
	<article class="space-y-6">
		<div
			class="font-term-mono text-[15px] md:text-[17px] leading-[1.5] text-term-muted flex items-center justify-between border-b border-term-border pb-2.5"
		>
			<a
				href={resolve('/(public)/projects')}
				class="group min-h-[44px] sm:min-h-0 inline-flex items-center gap-1 text-term-info underline hover:text-term-accent"
			>
				<span class="inline-block transition-transform duration-150 group-hover:-translate-x-0.5"
					>[&lt;</span
				>
				<span>projects]</span>
			</a>
			<div class="flex items-center gap-4">
				{#if data.prevProject}
					<a
						href={resolve('/(public)/projects/[slug]', { slug: data.prevProject.slug })}
						class="group min-h-[44px] sm:min-h-0 inline-flex items-center gap-1 text-term-info underline hover:text-term-accent"
						title={data.prevProject.title}
					>
						<span
							class="inline-block transition-transform duration-150 group-hover:-translate-x-0.5"
							>[&lt;</span
						>
						<span>prev]</span>
					</a>
				{/if}
				{#if data.nextProject}
					<a
						href={resolve('/(public)/projects/[slug]', { slug: data.nextProject.slug })}
						class="group min-h-[44px] sm:min-h-0 inline-flex items-center gap-1 text-term-info underline hover:text-term-accent"
						title={data.nextProject.title}
					>
						<span>[next</span>
						<span class="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
							>&gt;]</span
						>
					</a>
				{/if}
			</div>
		</div>

		<header class="space-y-1.5">
			<h1 class="font-term-mono text-[24px] md:text-[28px] leading-[1.3] font-bold text-term-fg">
				{data.project.title}
			</h1>
			<p class="font-term-mono text-[16px] md:text-[18px] leading-[1.6] text-term-muted">
				{data.project.tagline}
			</p>
		</header>

		<div
			class="border border-term-border border-t-2 {statusBorderClass(
				data.project.status
			)} bg-term-surface/70 px-4 sm:px-5 py-4"
		>
			<KeyValue items={linkItems}>
				<div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-0.5">
					<dt class="text-term-muted">status</dt>
					<dd>
						<Tag text={data.project.status} role={statusRole(data.project.status)} />
					</dd>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-0.5">
					<dt class="text-term-muted">tier</dt>
					<dd class="text-term-fg">T{data.project.tier}</dd>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-0.5">
					<dt class="text-term-muted">category</dt>
					<dd class="text-term-special lowercase">{data.project.category}</dd>
				</div>
				{#if data.project.technologies && data.project.technologies.length > 0}
					<div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-0.5">
						<dt class="text-term-muted">stack</dt>
						<dd class="flex flex-wrap gap-2 items-center">
							{#each data.project.technologies as tech (tech)}
								<Tag text={tech} role="special" />
							{/each}
						</dd>
					</div>
				{/if}
			</KeyValue>
		</div>

		{#if data.project.images && data.project.images.length > 0}
			<ImageViewer images={data.project.images} title={data.project.title} />
		{/if}

		<section>
			<Markdown content={data.project.description} />
		</section>
	</article>
</OutputBlock>
