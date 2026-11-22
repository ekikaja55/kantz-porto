<script lang="ts">
	interface TreeNode {
		id: string;
		label: string;
		children?: TreeNode[];
		icon?: string;
		iconColor?: string;
	}

	interface Props {
		nodes: TreeNode[];
		selectedId?: string | null;
		onselect?: (id: string) => void;
		class?: string;
	}

	let { nodes, selectedId = null, onselect, class: className = '' }: Props = $props();

	// Track expanded state per node id
	let expanded = $state<Record<string, boolean>>({});

	function toggle(id: string) {
		expanded[id] = !expanded[id];
	}

	function select(id: string) {
		onselect?.(id);
	}
</script>

{#snippet renderNodes(items: TreeNode[], depth: number)}
	{#each items as node (node.id)}
		<div class="select-none">
			<!-- Node row -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="flex items-center gap-0.5 cursor-pointer text-[11px] h-[18px] px-1
					{selectedId === node.id ? 'win-selected' : 'hover:bg-[#000080] hover:text-white'}"
				style="padding-left: {4 + depth * 12}px"
				onclick={() => {
					if (node.children && node.children.length > 0) toggle(node.id);
					select(node.id);
				}}
			>
				<!-- Expand/collapse indicator -->
				{#if node.children && node.children.length > 0}
					<span
						class="inline-flex items-center justify-center w-[11px] h-[11px] border border-[#808080] bg-white shrink-0 text-[9px] font-bold leading-none text-black mr-0.5"
					>
						{expanded[node.id] ? '-' : '+'}
					</span>
				{:else}
					<span class="w-[11px] mr-0.5 shrink-0"></span>
				{/if}

				<!-- Icon placeholder (keeps layout consistent) -->
				{#if node.icon}
					<span
						class="shrink-0 mr-1 inline-block"
						style="width:16px;height:16px;image-rendering:pixelated;"
					>
						<!-- Basic folder/file icon via CSS, no external import to avoid circular deps -->
						{#if node.icon === 'folder'}
							<svg width="16" height="16" viewBox="0 0 16 16" style="shape-rendering:crispEdges">
								<rect x="0" y="4" width="6" height="2" fill={node.iconColor ?? '#D97706'} />
								<rect x="0" y="6" width="16" height="8" fill={node.iconColor ?? '#D97706'} />
								<rect x="6" y="4" width="10" height="2" fill={node.iconColor ?? '#E5A30A'} />
							</svg>
						{:else if node.icon === 'file'}
							<svg width="16" height="16" viewBox="0 0 16 16" style="shape-rendering:crispEdges">
								<rect x="2" y="1" width="9" height="1" fill="#FFFFFF" />
								<rect x="2" y="2" width="1" height="10" fill="#FFFFFF" />
								<rect x="10" y="2" width="1" height="3" fill="#FFFFFF" />
								<rect x="2" y="12" width="11" height="1" fill="#FFFFFF" />
								<rect x="12" y="12" width="1" height="-9" fill="#FFFFFF" />
								<rect x="8" y="1" width="4" height="4" fill="#C0C0C0" />
								<rect x="12" y="5" width="1" height="8" fill="#FFFFFF" />
								<rect x="3" y="2" width="8" height="10" fill="#FFFFFF" />
								<rect x="2" y="1" width="10" height="14" fill="none" stroke="#808080" stroke-width="1" />
							</svg>
						{:else}
							<svg width="16" height="16" viewBox="0 0 16 16" style="shape-rendering:crispEdges">
								<rect x="2" y="2" width="12" height="12" fill={node.iconColor ?? '#808080'} />
							</svg>
						{/if}
					</span>
				{/if}

				<span class="truncate">{node.label}</span>
			</div>

			<!-- Children (recursive) -->
			{#if node.children && node.children.length > 0 && expanded[node.id]}
				<div class="border-l border-dotted border-[#808080]" style="margin-left: {12 + depth * 12}px">
					{@render renderNodes(node.children, depth + 1)}
				</div>
			{/if}
		</div>
	{/each}
{/snippet}

<div class="win-sunken-field overflow-y-auto {className}">
	{@render renderNodes(nodes, 0)}
</div>
