<script lang="ts">
	import Icon from './Icon.svelte';

	interface ChannelItem {
		id: string;
		title: string;
		tagline?: string;
		tech?: string[];
		liveUrl?: string;
	}

	interface Props {
		items?: ChannelItem[];
		ondismiss?: () => void;
	}

	let { items = [], ondismiss }: Props = $props();
</script>

<!-- Channel Bar: Active Desktop panel, right side of desktop -->
<aside
	class="win-raised flex flex-col w-[160px] h-full shrink-0 bg-[#C0C0C0] text-[11px] select-none overflow-hidden"
	aria-label="Channel Bar"
>
	<!-- Channel Bar Header -->
	<div
		class="flex items-center justify-between px-1.5 py-[3px] bg-gradient-to-r from-[#000080] to-[#1084D0] text-white shrink-0"
	>
		<span class="font-bold text-[11px] truncate tracking-wide">Channel Bar</span>
		<button
			type="button"
			aria-label="Close Channel Bar"
			onclick={ondismiss}
			class="win-raised flex items-center justify-center w-4 h-3.5 text-black active:win-pressed ml-1"
		>
			<svg width="8" height="7" viewBox="0 0 8 7" style="shape-rendering: crispEdges">
				<path
					d="M0 0h2v1H0zM1 1h2v1H1zM2 2h2v1H2zM3 2h2v1H3zM4 1h2v1H4zM5 0h2v1H5zM5 4h2v1H5zM4 3h2v1H4zM2 3h2v1H2zM1 4h2v1H1zM0 5h2v1H0z"
					fill="currentColor"
				/>
			</svg>
		</button>
	</div>

	<!-- Featured Projects -->
	<div class="flex-1 overflow-y-auto py-1">
		<div class="px-2 py-1 font-bold text-[10px] uppercase tracking-wider text-[#000000]">
			Featured Projects
		</div>

		{#each items as item (item.id)}
			<div class="border-b border-[#808080]/40">
				<button
					type="button"
					class="w-full text-left px-2 py-1.5 hover:win-selected group"
					onclick={() => item.liveUrl && window.open(item.liveUrl, '_blank', 'noopener')}
				>
					<div class="flex items-center gap-1 mb-0.5">
						<Icon name="folder" size={16} color="#D97706" />
						<span class="truncate font-medium text-[11px] group-hover:text-white"
							>{item.title}</span
						>
					</div>
					{#if item.tagline}
						<p class="text-[10px] text-[#4D4D4D] group-hover:text-white/80 leading-tight truncate">
							{item.tagline}
						</p>
					{/if}
					{#if item.tech && item.tech.length > 0}
						<p class="text-[10px] text-[#000080] group-hover:text-white/70 font-mono truncate mt-0.5">
							{item.tech.slice(0, 2).join(', ')}
						</p>
					{/if}
				</button>
			</div>
		{/each}

		{#if items.length === 0}
			<div class="px-2 py-3 text-[10px] text-[#4D4D4D] italic">No featured projects.</div>
		{/if}
	</div>

	<!-- Footer -->
	<div class="win-etched mx-1.5 my-1"></div>
	<div class="px-2 py-1 text-[10px] text-[#4D4D4D] text-center shrink-0">
		Active Desktop
	</div>
</aside>
