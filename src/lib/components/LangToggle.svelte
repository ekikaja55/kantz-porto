<script lang="ts">
	import Icon from '@iconify/svelte';
	import { i18n } from '#lib/i18n/index.svelte';
</script>

<button
	type="button"
	onclick={() => i18n.toggleLanguage()}
	aria-label={i18n.t.common.languageToggle}
	class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus:ring-neutral-600"
>
	<Icon icon="solar:global-bold-duotone" class="size-3.5 text-neutral-500" />
	<span class="font-mono uppercase font-semibold">
		{i18n.lang}
	</span>
</button>
