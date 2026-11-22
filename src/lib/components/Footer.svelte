<script lang="ts">
	import Icon from '@iconify/svelte';
	import { i18n } from '#lib/i18n/index.svelte';
</script>

<footer class="mt-20 border-t border-neutral-200/80 bg-white py-12 dark:border-neutral-800/80 dark:bg-neutral-950">
	<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
		<div class="flex items-center gap-2">
			<span class="flex size-6 items-center justify-center rounded-md bg-neutral-900 text-xs font-mono font-bold text-white dark:bg-white dark:text-neutral-900">
				K
			</span>
			<span class="font-display text-sm font-semibold text-neutral-900 dark:text-white">
				Rizki Arkant Pratama
			</span>
		</div>

		<p class="text-xs text-neutral-500 dark:text-neutral-400">
			{i18n.t.footer.builtWith}
		</p>

		<div class="flex items-center gap-1.5 text-xs text-neutral-500">
			<Icon icon="solar:shield-check-bold-duotone" class="size-4 text-emerald-500" />
			<span>{i18n.t.footer.rights}</span>
		</div>
	</div>
</footer>
