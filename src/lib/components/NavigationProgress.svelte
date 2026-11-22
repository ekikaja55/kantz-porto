<script lang="ts">
	import { navigating } from '$app/state';

	let isNavigating = $derived(Boolean(navigating.to));
</script>

{#if isNavigating}
	<div
		class="fixed top-0 left-0 right-0 z-50 h-0.5 w-full overflow-hidden bg-neutral-200/50 dark:bg-neutral-800/50"
		role="progressbar"
		aria-label="Loading page"
	>
		<div
			class="h-full w-full bg-neutral-900 dark:bg-white animate-[progress_1.2s_ease-in-out_infinite]"
		></div>
	</div>
{/if}

<style>
	@keyframes progress {
		0% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
