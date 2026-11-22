<script lang="ts">
	import type { Snippet } from 'svelte';

	interface TocItem {
		id: string;
		label: string;
		children?: TocItem[];
	}

	interface Props {
		title: string;
		tocItems: TocItem[];
		selectedId?: string | null;
		onselect?: (id: string) => void;
		children?: Snippet;
		class?: string;
	}

	let {
		title,
		tocItems,
		selectedId = null,
		onselect,
		children,
		class: className = ''
	}: Props = $props();

	let expanded = $state<Record<string, boolean>>({});

	function toggle(id: string) {
		expanded[id] = !expanded[id];
	}

	function select(id: string) {
		onselect?.(id);
	}
</script>

{#snippet renderToc(items: TocItem[], depth: number)}
	{#each items as item (item.id)}
		<div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex items-center gap-1 text-[11px] h-[20px] cursor-pointer
					{selectedId === item.id ? 'win-selected' : 'hover:bg-[#000080] hover:text-white'}"
				style="padding-left: {4 + depth * 14}px"
				onclick={() => {
					if (item.children?.length) toggle(item.id);
					select(item.id);
				}}
			>
				{#if item.children?.length}
					<span
						class="inline-flex items-center justify-center w-[11px] h-[11px] border border-[#808080] bg-white shrink-0 text-[9px] font-bold leading-none text-black"
					>
						{expanded[item.id] ? '-' : '+'}
					</span>
				{:else}
					<span class="w-[11px] shrink-0"></span>
				{/if}
				<!-- Book icon for companies, page icon for roles -->
				{#if depth === 0}
					<svg width="14" height="14" viewBox="0 0 14 14" style="shape-rendering:crispEdges" class="shrink-0">
						<rect x="1" y="1" width="2" height="12" fill="#808080" />
						<rect x="3" y="2" width="10" height="10" fill="#FFFFFF" />
						<rect x="3" y="1" width="10" height="1" fill="#C0C0C0" />
						<rect x="3" y="12" width="10" height="1" fill="#C0C0C0" />
						<rect x="12" y="2" width="1" height="10" fill="#808080" />
					</svg>
				{:else}
					<svg width="14" height="14" viewBox="0 0 14 14" style="shape-rendering:crispEdges" class="shrink-0">
						<rect x="2" y="1" width="8" height="1" fill="#C0C0C0" />
						<rect x="2" y="2" width="1" height="10" fill="#C0C0C0" />
						<rect x="9" y="2" width="1" height="3" fill="#C0C0C0" />
						<rect x="3" y="2" width="6" height="10" fill="#FFFFFF" />
						<rect x="2" y="12" width="9" height="1" fill="#808080" />
						<rect x="10" y="5" width="1" height="8" fill="#808080" />
					</svg>
				{/if}
				<span class="truncate">{item.label}</span>
			</div>
			{#if item.children?.length && expanded[item.id]}
				{@render renderToc(item.children, depth + 1)}
			{/if}
		</div>
	{/each}
{/snippet}

<!-- HTML Help two-panel layout -->
<div class="flex h-full min-h-0 {className}">
	<!-- TOC Panel (left) -->
	<div class="win-sunken-field flex flex-col w-[180px] shrink-0 overflow-hidden">
		<!-- Tab header -->
		<div class="win-raised px-2 py-0.5 text-[11px] font-bold border-b border-[#808080] bg-[#C0C0C0]">
			{title || 'Contents'}
		</div>
		<div class="flex-1 overflow-y-auto">
			{@render renderToc(tocItems, 0)}
		</div>
	</div>

	<!-- Resizer divider -->
	<div class="w-[4px] bg-[#C0C0C0] win-etched shrink-0"></div>

	<!-- Content Panel (right) -->
	<div class="flex-1 overflow-y-auto bg-white win-sunken p-3 win-prose text-sm">
		{#if children}
			{@render children()}
		{:else}
			<p class="text-[#808080]">Select a topic from the contents panel.</p>
		{/if}
	</div>
</div>
