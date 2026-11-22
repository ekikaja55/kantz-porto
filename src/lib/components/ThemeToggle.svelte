<script lang="ts">
	import Icon from '@iconify/svelte';
	import { toggleMode, mode } from 'mode-watcher';
	import { i18n } from '#lib/i18n/index.svelte';
</script>

<button
	type="button"
	data-testid="theme-toggle"
	onclick={toggleMode}
	aria-label={i18n.t.common.themeToggle}
	class="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 shadow-xs transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus:ring-neutral-600"
>
	{#if mode.current === 'dark'}
		<Icon icon="solar:sun-bold-duotone" class="size-4 text-amber-400" />
	{:else}
		<Icon icon="solar:moon-bold-duotone" class="size-4 text-neutral-700" />
	{/if}
</button>
