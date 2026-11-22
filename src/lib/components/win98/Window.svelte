<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	interface Props {
		title: string;
		icon?: string;
		active?: boolean;
		closable?: boolean;
		minimizable?: boolean;
		maximizable?: boolean;
		maximized?: boolean;
		helpButton?: boolean;
		width?: string;
		height?: string;
		onclose?: () => void;
		onminimize?: () => void;
		onmaximize?: () => void;
		ontitlepointerdown?: (e: PointerEvent) => void;
		menuBar?: Snippet;
		toolbar?: Snippet;
		statusBar?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		title,
		icon = 'folder',
		active = true,
		closable = true,
		minimizable = true,
		maximizable = true,
		maximized = false,
		helpButton = false,
		width = 'auto',
		height = 'auto',
		onclose,
		onminimize,
		onmaximize,
		ontitlepointerdown,
		menuBar,
		toolbar,
		statusBar,
		children,
		class: className = ''
	}: Props = $props();
</script>

<div
	class="win-raised flex flex-col p-[3px] select-none text-black {className}"
	style:width
	style:height
	role="region"
	aria-label={title}
>
	<!-- Title Bar -->
	<div
		class="flex items-center justify-between px-1.5 py-[3px] gap-2 cursor-default {active
			? 'bg-gradient-to-r from-[#000080] to-[#1084D0] text-white'
			: 'bg-gradient-to-r from-[#808080] to-[#B5B5B5] text-[#DFDFDF]'}"
		onpointerdown={ontitlepointerdown}
		ondblclick={onmaximize}
		role="toolbar"
		tabindex="-1"
		aria-label="{title} Title Bar"
	>
		<div class="flex items-center gap-1.5 min-w-0 overflow-hidden pointer-events-none">
			{#if icon}
				<Icon name={icon} size={18} />
			{/if}
			<span class="font-bold text-[13px] truncate tracking-wide">{title}</span>
		</div>

		<!-- Window Controls -->
		<div
			class="flex items-center gap-[2px] shrink-0"
			role="group"
			aria-label="Window Controls"
			onpointerdown={(e) => e.stopPropagation()}
		>
			{#if helpButton}
				<button
					type="button"
					aria-label="Help"
					class="win-raised flex items-center justify-center w-[18px] h-[16px] text-black text-[11px] font-bold active:win-pressed active:translate-x-[0.5px] active:translate-y-[0.5px]"
				>
					?
				</button>
			{/if}
			{#if minimizable}
				<button
					type="button"
					aria-label="Minimize"
					onclick={onminimize}
					class="win-raised flex items-center justify-center w-[18px] h-[16px] text-black active:win-pressed active:translate-x-[0.5px] active:translate-y-[0.5px]"
				>
					<svg width="8" height="8" viewBox="0 0 6 6" class="shape-crisp">
						<rect x="0" y="4" width="6" height="2" fill="currentColor" />
					</svg>
				</button>
			{/if}
			{#if maximizable}
				<button
					type="button"
					aria-label={maximized ? 'Restore' : 'Maximize'}
					onclick={onmaximize}
					class="win-raised flex items-center justify-center w-[18px] h-[16px] text-black active:win-pressed active:translate-x-[0.5px] active:translate-y-[0.5px]"
				>
					{#if maximized}
						<!-- Restore icon (two overlapping squares) -->
						<svg width="9" height="9" viewBox="0 0 8 8" class="shape-crisp">
							<rect x="2" y="0" width="6" height="2" fill="currentColor" />
							<rect x="7" y="2" width="1" height="4" fill="currentColor" />
							<rect x="0" y="2" width="6" height="2" fill="currentColor" />
							<rect x="0" y="4" width="1" height="4" fill="currentColor" />
							<rect x="5" y="4" width="1" height="4" fill="currentColor" />
							<rect x="0" y="7" width="6" height="1" fill="currentColor" />
						</svg>
					{:else}
						<svg width="9" height="8" viewBox="0 0 8 7" class="shape-crisp">
							<rect x="0" y="0" width="8" height="2" fill="currentColor" />
							<rect x="0" y="2" width="1" height="5" fill="currentColor" />
							<rect x="7" y="2" width="1" height="5" fill="currentColor" />
							<rect x="0" y="6" width="8" height="1" fill="currentColor" />
						</svg>
					{/if}
				</button>
			{/if}
			{#if closable}
				<button
					type="button"
					aria-label="Close"
					onclick={onclose}
					class="win-raised flex items-center justify-center w-[18px] h-[16px] ml-[2px] text-black active:win-pressed active:translate-x-[0.5px] active:translate-y-[0.5px]"
				>
					<svg width="9" height="8" viewBox="0 0 8 7" class="shape-crisp">
						<path
							d="M0 0h2v1H0zM1 1h2v1H1zM2 2h2v1H2zM3 2h2v1H3zM4 1h2v1H4zM5 0h2v1H5zM5 4h2v1H5zM4 3h2v1H4zM2 3h2v1H2zM1 4h2v1H1zM0 5h2v1H0z"
							fill="currentColor"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Menu Bar (Optional) -->
	{#if menuBar}
		<div class="flex items-center px-1 py-0.5 border-b border-[#808080] text-[11px]">
			{@render menuBar()}
		</div>
	{/if}

	<!-- Toolbar (Optional) -->
	{#if toolbar}
		<div class="flex items-center gap-1 px-1 py-1 border-b border-[#808080] text-[11px]">
			{@render toolbar()}
		</div>
	{/if}

	<!-- Window Body / Content -->
	<div class="flex-1 overflow-auto bg-white win-sunken p-2 text-black">
		{#if children}
			{@render children()}
		{/if}
	</div>

	<!-- Status Bar (Optional) -->
	{#if statusBar}
		<div class="pt-[2px]">
			{@render statusBar()}
		</div>
	{/if}
</div>

<style>
	.shape-crisp {
		shape-rendering: crispEdges;
	}
</style>
