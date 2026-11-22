<script lang="ts">
	import Icon from '@iconify/svelte';
	import { performanceStore } from '#lib/stores/performance.svelte';
	import { toast } from '#lib/stores/toast.svelte';
	import { i18n } from '#lib/i18n/index.svelte';

	function handleToggle() {
		const newState = performanceStore.toggle();
		if (newState) {
			toast.info(
				i18n.lang === 'id'
					? 'Performance Mode aktif: Efek animasi dikurangi.'
					: 'Performance Mode enabled: Reduced animation FX.'
			);
		} else {
			toast.info(
				i18n.lang === 'id'
					? 'Performance Mode nonaktif: Efek animasi penuh.'
					: 'Performance Mode disabled: Full animation FX.'
			);
		}
	}
</script>

<button
	type="button"
	onclick={handleToggle}
	title={performanceStore.performanceMode ? i18n.t.common.performanceModeOn : i18n.t.common.performanceModeOff}
	aria-label={i18n.t.common.performanceMode}
	class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus:ring-neutral-600"
>
	<Icon
		icon={performanceStore.performanceMode ? 'solar:bolt-bold-duotone' : 'solar:speedometer-bold-duotone'}
		class={`size-3.5 ${performanceStore.performanceMode ? 'text-emerald-500' : 'text-neutral-400'}`}
	/>
	<span class="hidden sm:inline font-mono">
		{performanceStore.performanceMode ? 'FX: ECO' : 'FX: FULL'}
	</span>
</button>
