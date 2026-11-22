<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title = '',
		children,
		footer,
		onClose
	}: {
		open?: boolean;
		title?: string;
		children?: Snippet;
		footer?: Snippet;
		onClose?: () => void;
	} = $props();

	let dialogEl: HTMLDialogElement | null = $state(null);

	$effect(() => {
		if (open && dialogEl && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl && dialogEl.open) {
			dialogEl.close();
		}
	});

	function handleClose() {
		open = false;
		if (onClose) onClose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogEl) {
			handleClose();
		}
	}
</script>

<dialog
	bind:this={dialogEl}
	onclose={handleClose}
	onclick={handleBackdropClick}
	class="m-auto max-w-lg w-[calc(100%-2rem)] rounded-2xl border border-neutral-200 bg-white p-0 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
>
	<div class="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
		<h3 class="text-base font-semibold text-neutral-900 dark:text-white">{title}</h3>
		<button
			type="button"
			onclick={handleClose}
			aria-label="Close dialog"
			class="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
		>
			<Icon icon="solar:close-circle-bold-duotone" class="size-5" />
		</button>
	</div>

	<div class="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300">
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if footer}
		<div class="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
			{@render footer()}
		</div>
	{/if}
</dialog>
