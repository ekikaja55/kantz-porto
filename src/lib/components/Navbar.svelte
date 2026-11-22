<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { i18n } from '#lib/i18n/index.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import PerformanceToggle from './PerformanceToggle.svelte';
	import LangToggle from './LangToggle.svelte';

	let isMobileMenuOpen = $state(false);
	let user = $derived(page.data?.user);
</script>

<header class="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/80">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
		<a href={resolve('/(public)')} class="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
			<span class="flex size-7 items-center justify-center rounded-md bg-neutral-900 text-xs font-mono font-bold text-white dark:bg-white dark:text-neutral-900">
				K
			</span>
			<span>Kantz</span>
		</a>

		<nav class="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
			<a href={resolve('/(public)')} class="transition-colors hover:text-neutral-900 dark:hover:text-white">
				{i18n.t.nav.home}
			</a>
			<a href={resolve('/(public)/projects')} class="transition-colors hover:text-neutral-900 dark:hover:text-white">
				{i18n.t.nav.projects}
			</a>
			<a href={resolve('/(public)#skills')} class="transition-colors hover:text-neutral-900 dark:hover:text-white">
				{i18n.t.nav.skills}
			</a>
			<a href={resolve('/(public)#experience')} class="transition-colors hover:text-neutral-900 dark:hover:text-white">
				{i18n.t.nav.experience}
			</a>
			<a href={resolve('/(public)#contact')} class="transition-colors hover:text-neutral-900 dark:hover:text-white">
				{i18n.t.nav.contact}
			</a>
			{#if user}
				<a
					href={resolve('/admin')}
					class="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
				>
					<Icon icon="solar:widget-bold-duotone" class="size-3.5" />
					Dashboard
				</a>
			{/if}
		</nav>

		<div class="flex items-center gap-2">
			<LangToggle />
			<PerformanceToggle />
			<ThemeToggle />

			<button
				type="button"
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="inline-flex md:hidden items-center justify-center rounded-lg border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
				aria-label="Toggle mobile menu"
			>
				<Icon icon={isMobileMenuOpen ? 'solar:close-circle-bold-duotone' : 'solar:hamburger-menu-bold-duotone'} class="size-4" />
			</button>
		</div>
	</div>

	{#if isMobileMenuOpen}
		<div class="border-b border-neutral-200 bg-white px-4 py-4 md:hidden dark:border-neutral-800 dark:bg-neutral-950">
			<nav class="flex flex-col gap-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
				<a href={resolve('/(public)')} onclick={() => (isMobileMenuOpen = false)} class="py-1 hover:text-neutral-900 dark:hover:text-white">
					{i18n.t.nav.home}
				</a>
				<a href={resolve('/(public)/projects')} onclick={() => (isMobileMenuOpen = false)} class="py-1 hover:text-neutral-900 dark:hover:text-white">
					{i18n.t.nav.projects}
				</a>
				<a href={resolve('/(public)#skills')} onclick={() => (isMobileMenuOpen = false)} class="py-1 hover:text-neutral-900 dark:hover:text-white">
					{i18n.t.nav.skills}
				</a>
				<a href={resolve('/(public)#experience')} onclick={() => (isMobileMenuOpen = false)} class="py-1 hover:text-neutral-900 dark:hover:text-white">
					{i18n.t.nav.experience}
				</a>
				<a href={resolve('/(public)#contact')} onclick={() => (isMobileMenuOpen = false)} class="py-1 hover:text-neutral-900 dark:hover:text-white">
					{i18n.t.nav.contact}
				</a>
				{#if user}
					<a
						href={resolve('/admin')}
						onclick={() => (isMobileMenuOpen = false)}
						class="inline-flex items-center gap-1.5 py-1 font-semibold text-neutral-900 dark:text-white"
					>
						<Icon icon="solar:widget-bold-duotone" class="size-4" />
						Dashboard
					</a>
				{/if}
			</nav>
		</div>
	{/if}
</header>
