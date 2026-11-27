<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { PROFILE } from '#lib/constants/profile';
	import Motd from '#lib/components/terminal/Motd.svelte';
	import OutputBlock from '#lib/components/terminal/OutputBlock.svelte';
	import Panel from '#lib/components/terminal/Panel.svelte';
	import Tag from '#lib/components/terminal/Tag.svelte';
	import { getTheme, toggleTheme } from '#lib/terminal/theme.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let hoveredSwatch = $state<string | null>(null);

	const currentTheme = $derived(getTheme());
	const visibleFeatured = $derived(data.featuredProjects.slice(0, 4));
	const remainingFeaturedCount = $derived(Math.max(0, data.featuredProjects.length - 4));

	const description =
		'Rizki Arkant Pratama (Kantz) - Full-Stack Web Engineer specializing in performant web architecture, TypeScript, and PostgreSQL.';

	const specRows = [
		{ key: 'roles', value: PROFILE.roles.slice(1).join(', ') },
		{
			key: 'education',
			value: `${PROFILE.education.institution} (${PROFILE.education.status})`
		},
		{ key: 'focus', value: 'SvelteKit, TypeScript, PostgreSQL' },
		{ key: 'location', value: 'Surabaya, ID' }
	] as const;

	const PALETTE_SWATCHES = [
		{ label: 'surface', swatchClass: 'bg-term-surface border border-term-border' },
		{ label: 'danger', swatchClass: 'bg-term-danger' },
		{ label: 'ok', swatchClass: 'bg-term-ok' },
		{ label: 'warn', swatchClass: 'bg-term-warn' },
		{ label: 'info', swatchClass: 'bg-term-info' },
		{ label: 'special', swatchClass: 'bg-term-special' },
		{ label: 'accent', swatchClass: 'bg-term-accent' },
		{ label: 'fg', swatchClass: 'bg-term-fg' }
	] as const;

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

	function statusSpotColor(status: string): string {
		const role = statusRole(status);
		if (role === 'ok') return 'var(--t-ok)';
		if (role === 'warn') return 'var(--t-warn)';
		return 'var(--t-accent)';
	}

	function handleCardPointerMove(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement | null;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		el.style.setProperty('--mx', `${Math.round(e.clientX - rect.left)}px`);
		el.style.setProperty('--my', `${Math.round(e.clientY - rect.top)}px`);
	}

	function handleQuickThemeToggle(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement | null;
		if (e.clientX === 0 && e.clientY === 0 && target) {
			const rect = target.getBoundingClientRect();
			toggleTheme(true, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
			return;
		}
		toggleTheme(true, { x: e.clientX, y: e.clientY });
	}
</script>

<svelte:head>
	<title>about_me | kantZ Workstation</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="about_me | kantZ Workstation" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{page.url.origin}/og-default.png" />
</svelte:head>

<Motd />

<OutputBlock command="about_me">
	<h1 class="sr-only">about_me</h1>

	<div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8 items-start">
		<div class="space-y-3">
			<header class="space-y-1">
				<p class="font-term-mono text-[24px] md:text-[28px] leading-[1.25] font-bold text-term-fg">
					{PROFILE.name} <span class="text-term-muted font-normal">({PROFILE.alias})</span>
				</p>
				<p class="font-term-mono text-[16px] md:text-[18px] leading-[1.45] text-term-accent">
					{PROFILE.roles[0]}
				</p>
			</header>

			<p
				class="font-term-sans text-[17px] md:text-[18px] leading-[1.65] text-term-fg max-w-[62ch] [text-wrap:pretty]"
			>
				{PROFILE.bio}
			</p>
		</div>

		<div class="space-y-3 lg:border-l lg:border-term-border lg:pl-6">
			<dl class="space-y-1 font-term-mono text-[14px] md:text-[15px] leading-[1.45]">
				{#each specRows as row (row.key)}
					<div class="grid grid-cols-[92px_1fr] gap-x-3">
						<dt class="text-term-muted">{row.key}</dt>
						<dd class="min-w-0 text-term-fg break-words">{row.value}</dd>
					</div>
				{/each}
			</dl>

			<div class="pt-0.5 flex flex-wrap items-center gap-3">
				<div
					class="flex items-center gap-1.5"
					data-testid="palette-swatches"
					aria-label="Active terminal palette"
				>
					{#each PALETTE_SWATCHES as swatch (swatch.label)}
						<span
							title={swatch.label}
							role="presentation"
							onmouseenter={() => (hoveredSwatch = swatch.label)}
							onmouseleave={() => (hoveredSwatch = null)}
							class="inline-block w-[14px] h-[14px] transition-transform duration-150 hover:scale-125 {swatch.swatchClass}"
						></span>
					{/each}
				</div>

				<button
					type="button"
					onclick={handleQuickThemeToggle}
					aria-label="Toggle active palette ({currentTheme})"
					class="px-2 py-0.5 border border-term-border bg-term-surface font-term-mono text-[12px] leading-[1.3] text-term-special hover:border-term-special hover:bg-term-special/10 transition-colors duration-150 cursor-pointer"
				>
					{hoveredSwatch ? `token: ${hoveredSwatch}` : `palette: ${currentTheme}`}
				</button>
			</div>
		</div>
	</div>

	<Panel title="featured" titleClass="text-term-accent" paddingClass="p-3 sm:p-3.5" class="mb-0">
		{#if visibleFeatured.length === 0}
			<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-muted py-1">
				no featured projects yet
			</p>
		{:else}
			<ul
				class="grid grid-cols-1 md:grid-cols-2 {visibleFeatured.length === 3
					? 'lg:grid-cols-3'
					: 'lg:grid-cols-4'} gap-3 font-term-mono text-[15px] md:text-[16px] leading-[1.45]"
			>
				{#each visibleFeatured as project, idx (project.id)}
					<li class="flex term-stagger" style="--stagger: {idx};">
						<a
							href={resolve('/(public)/projects/[slug]', { slug: project.slug })}
							onpointermove={handleCardPointerMove}
							style="--spot-color: {statusSpotColor(project.status)};"
							class="term-spotlight group flex-1 flex flex-col border border-term-border border-t-2 {statusBorderClass(
								project.status
							)} bg-term-surface p-2.5 no-underline"
						>
							<div
								class="relative z-10 flex-1 flex flex-col gap-1 transition-transform duration-150 ease-out group-hover:-translate-y-0.5"
							>
								<div class="flex items-center justify-between gap-2 text-[13px] leading-[1.35]">
									<span class="text-term-muted">T{project.tier}</span>
									<Tag text={project.status} role={statusRole(project.status)} />
								</div>
								<span
									class="font-bold text-[15px] md:text-[16px] leading-[1.3] text-term-info group-hover:text-term-accent underline group-hover:no-underline line-clamp-2"
								>
									{project.title}
								</span>
								<p class="text-[13px] md:text-[14px] leading-[1.4] text-term-muted line-clamp-2">
									{project.tagline}
								</p>
								{#if project.technologies && project.technologies.length > 0}
									<div
										class="mt-auto pt-1 flex items-center gap-1.5 overflow-hidden text-[12px] leading-[1.3] text-term-special"
									>
										{#each project.technologies.slice(0, 2) as tech (tech)}
											<span
												class="truncate px-1.5 py-0.5 border border-term-border/80 bg-term-bg/60"
											>
												{tech}
											</span>
										{/each}
										{#if project.technologies.length > 2}
											<span class="shrink-0 text-term-muted text-[11px]">
												+{project.technologies.length - 2}
											</span>
										{/if}
									</div>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
			{#if remainingFeaturedCount > 0}
				<div class="mt-2 flex justify-end font-term-mono text-[14px] leading-[1.4]">
					<a
						href={resolve('/(public)/projects')}
						class="group inline-flex items-center gap-1 text-term-info underline hover:text-term-accent"
					>
						<span>+{remainingFeaturedCount} more in projects</span>
						<span class="inline-block transition-transform duration-150 group-hover:translate-x-0.5"
							>&gt;</span
						>
					</a>
				</div>
			{/if}
		{/if}
	</Panel>
</OutputBlock>
