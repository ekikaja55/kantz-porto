<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		open?: boolean;
		title?: string;
		type?: 'info' | 'warning' | 'error' | 'question';
		message?: string;
		confirmText?: string;
		cancelText?: string;
		onconfirm?: () => void;
		oncancel?: () => void;
		children?: Snippet;
	}

	let {
		open = false,
		title = 'Information',
		type = 'info',
		message,
		confirmText = 'OK',
		cancelText,
		onconfirm,
		oncancel,
		children
	}: Props = $props();

	let dialogEl: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (open && dialogEl && !dialogEl.open) {
			dialogEl.showModal();
		} else if (!open && dialogEl && dialogEl.open) {
			dialogEl.close();
		}
	});

	const typeIcons: Record<string, { icon: string; color: string }> = {
		info: { icon: 'info', color: '#000080' },
		warning: { icon: 'warning', color: '#808000' },
		error: { icon: 'error', color: '#800000' },
		question: { icon: 'help', color: '#008080' }
	};
</script>

<dialog
	bind:this={dialogEl}
	onclose={oncancel}
	class="win-raised p-[3px] bg-[#C0C0C0] text-black select-none max-w-md w-full backdrop:bg-transparent shadow-[2px_2px_0_#000000] focus:outline-none fixed inset-0 m-auto"
	aria-labelledby="dialog-title"
>
	<!-- Title Bar with ? and X -->
	<div
		class="flex items-center justify-between px-1.5 py-[3px] bg-gradient-to-r from-[#000080] to-[#1084D0] text-white"
	>
		<span id="dialog-title" class="font-bold text-[13px] truncate">{title}</span>
		<div class="flex items-center gap-[2px]">
			<button
				type="button"
				aria-label="Help"
				class="win-raised flex items-center justify-center w-[18px] h-[16px] text-black text-[11px] font-bold"
			>
				?
			</button>
			<button
				type="button"
				aria-label="Close"
				onclick={oncancel}
				class="win-raised flex items-center justify-center w-[18px] h-[16px] text-black active:win-pressed"
			>
				<svg width="9" height="8" viewBox="0 0 8 7" class="shape-crisp">
					<path
						d="M0 0h2v1H0zM1 1h2v1H1zM2 2h2v1H2zM3 2h2v1H3zM4 1h2v1H4zM5 0h2v1H5zM5 4h2v1H5zM4 3h2v1H4zM2 3h2v1H2zM1 4h2v1H1zM0 5h2v1H0z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Dialog Content -->
	<div class="p-4 flex items-start gap-4">
		{#if typeIcons[type]}
			<div class="shrink-0">
				<Icon name={typeIcons[type].icon} size={32} color={typeIcons[type].color} />
			</div>
		{/if}

		<div class="flex-1 text-[13px] leading-relaxed">
			{#if message}
				<p>{message}</p>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>

	<!-- Actions / Buttons -->
	<div class="flex items-center justify-end gap-2 px-4 pb-3">
		<Button onclick={onconfirm} class="min-w-[75px]">
			{confirmText}
		</Button>
		{#if cancelText}
			<Button onclick={oncancel} class="min-w-[75px]">
				{cancelText}
			</Button>
		{/if}
	</div>
</dialog>

<style>
	.shape-crisp {
		shape-rendering: crispEdges;
	}
	dialog::backdrop {
		background: transparent;
	}
</style>
