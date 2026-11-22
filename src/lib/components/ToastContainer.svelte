<script lang="ts">
	import Icon from '@iconify/svelte';
	import { toast } from '#lib/stores/toast.svelte';
</script>

{#if toast.toasts.length > 0}
	<div
		class="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 p-2 sm:max-w-md"
		role="region"
		aria-label="Notifications"
	>
		{#each toast.toasts as item (item.id)}
			<div
				class="pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-200
					{item.type === 'success'
					? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/80 dark:text-emerald-200'
					: item.type === 'error'
						? 'border-rose-500/20 bg-rose-500/10 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/80 dark:text-rose-200'
						: item.type === 'warning'
							? 'border-amber-500/20 bg-amber-500/10 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/80 dark:text-amber-200'
							: 'border-neutral-200 bg-white/90 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-200'}"
				role="status"
			>
				{#if item.type === 'success'}
					<Icon icon="solar:check-circle-bold-duotone" class="size-5 shrink-0 text-emerald-500" />
				{:else if item.type === 'error'}
					<Icon icon="solar:danger-triangle-bold-duotone" class="size-5 shrink-0 text-rose-500" />
				{:else if item.type === 'warning'}
					<Icon icon="solar:danger-circle-bold-duotone" class="size-5 shrink-0 text-amber-500" />
				{:else}
					<Icon icon="solar:info-circle-bold-duotone" class="size-5 shrink-0 text-blue-500" />
				{/if}

				<p class="flex-1 text-sm font-medium leading-snug">{item.message}</p>

				<button
					type="button"
					onclick={() => toast.dismiss(item.id)}
					aria-label="Dismiss notification"
					class="shrink-0 rounded p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-hidden"
				>
					<Icon icon="solar:close-circle-bold-duotone" class="size-4" />
				</button>
			</div>
		{/each}
	</div>
{/if}
