<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { i18n } from '#lib/i18n/index.svelte';
</script>

<section class="mx-auto flex max-w-6xl flex-col items-start justify-center px-4 pt-16 pb-12 sm:px-6 lg:pt-24 lg:pb-16">
	<div class="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs font-mono font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
		<Icon icon="solar:code-circle-bold-duotone" class="size-4 text-emerald-500" />
		<span>{i18n.t.hero.badge}</span>
	</div>

	<h1 class="mt-6 font-display text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl dark:text-white max-w-4xl">
		{i18n.t.hero.tagline}
	</h1>

	<p class="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300">
		{i18n.t.hero.subtext}
	</p>

	<div class="mt-8 flex flex-wrap items-center gap-4">
		<a
			href={resolve('/(public)/projects')}
			class="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			<Icon icon="solar:folder-with-files-bold-duotone" class="size-4" />
			<span>{i18n.t.hero.ctaProjects}</span>
		</a>

		<a
			href={resolve('/(public)#contact')}
			class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-800 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
		>
			<Icon icon="solar:letter-bold-duotone" class="size-4" />
			<span>{i18n.t.hero.ctaContact}</span>
		</a>

		<a
			href="https://github.com/ekikaja55"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
			aria-label="GitHub Profile"
		>
			<Icon icon="solar:code-file-bold-duotone" class="size-4" />
			<span>GitHub</span>
		</a>
	</div>
</section>
