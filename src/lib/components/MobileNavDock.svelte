<script lang="ts">
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { i18n } from '#lib/i18n/index.svelte';

	let isVisible = $state(true);
	let lastScrollY = 0;
	let user = $derived(page.data?.user);

	function onScroll() {
		const currentScrollY = window.scrollY;
		if (currentScrollY > lastScrollY && currentScrollY > 80) {
			// Scrolling down
			isVisible = false;
		} else {
			// Scrolling up
			isVisible = true;
		}
		lastScrollY = currentScrollY;
	}
</script>

<svelte:window onscroll={onScroll} />

<div
	class="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 transition-all duration-300 md:hidden {isVisible
		? 'translate-y-0 opacity-100'
		: 'translate-y-16 pointer-events-none opacity-0'}"
>
	<nav
		class="flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/90 p-1.5 shadow-xl backdrop-blur-lg dark:border-neutral-800/80 dark:bg-neutral-900/90"
		aria-label="Mobile bottom navigation"
	>
		<a
			href={resolve('/(public)')}
			aria-label={i18n.t.nav.home}
			class="flex size-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
		>
			<Icon icon="solar:home-2-bold-duotone" class="size-5" />
		</a>

		<a
			href={resolve('/(public)/projects')}
			aria-label={i18n.t.nav.projects}
			class="flex size-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
		>
			<Icon icon="solar:folder-with-files-bold-duotone" class="size-5" />
		</a>

		<a
			href={resolve('/(public)#skills')}
			aria-label={i18n.t.nav.skills}
			class="flex size-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
		>
			<Icon icon="solar:code-square-bold-duotone" class="size-5" />
		</a>

		<a
			href={resolve('/(public)#experience')}
			aria-label={i18n.t.nav.experience}
			class="flex size-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
		>
			<Icon icon="solar:case-round-bold-duotone" class="size-5" />
		</a>

		{#if user}
			<a
				href={resolve('/admin')}
				aria-label="Dashboard"
				class="flex size-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
			>
				<Icon icon="solar:widget-bold-duotone" class="size-5" />
			</a>
		{/if}
	</nav>
</div>
