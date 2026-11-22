<script lang="ts">
	interface MenuItem {
		id: string;
		label: string;
		shortcut?: string;
		disabled?: boolean;
		separator?: boolean;
		checked?: boolean;
	}

	interface MenuSection {
		id: string;
		label: string;
		items: MenuItem[];
	}

	interface Props {
		menus: MenuSection[];
		onselect?: (menuId: string, itemId: string) => void;
		class?: string;
	}

	let { menus, onselect, class: className = '' }: Props = $props();

	let openMenuId = $state<string | null>(null);

	function toggleMenu(id: string) {
		openMenuId = openMenuId === id ? null : id;
	}

	function handleItemClick(menuId: string, item: MenuItem) {
		if (item.disabled || item.separator) return;
		openMenuId = null;
		onselect?.(menuId, item.id);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			openMenuId = null;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- MenuBar Bar -->
<nav
	class="relative flex items-center gap-0.5 text-[11px] select-none text-black {className}"
	aria-label="Menu bar"
>
	{#each menus as menu (menu.id)}
		<div class="relative">
			<button
				type="button"
				onclick={() => toggleMenu(menu.id)}
				onpointerenter={() => {
					if (openMenuId && openMenuId !== menu.id) openMenuId = menu.id;
				}}
				class="px-2 py-0.5 cursor-pointer focus:outline-none {openMenuId === menu.id
					? 'win-sunken bg-[#000080] text-white'
					: 'hover:win-raised-sm'}"
				aria-expanded={openMenuId === menu.id}
				aria-haspopup="menu"
			>
				<span><u>{menu.label[0]}</u>{menu.label.slice(1)}</span>
			</button>

			<!-- Dropdown menu -->
			{#if openMenuId === menu.id}
				<!-- Backdrop -->
				<div
					class="fixed inset-0 z-40 bg-transparent"
					role="presentation"
					onclick={() => (openMenuId = null)}
				></div>

				<div
					class="win-raised absolute top-full left-0 z-50 min-w-[150px] p-[2px] bg-[#C0C0C0] text-black shadow-[2px_2px_0_#000000]"
					role="menu"
					aria-label={menu.label}
				>
					{#each menu.items as item (item.id)}
						{#if item.separator}
							<div class="win-etched my-1 mx-1"></div>
						{:else}
							<button
								type="button"
								role="menuitem"
								disabled={item.disabled}
								onclick={() => handleItemClick(menu.id, item)}
								class="flex items-center justify-between w-full px-3 py-1 text-left text-[11px] disabled:text-[#808080] disabled:pointer-events-none {item.disabled
									? ''
									: 'hover:win-selected group'}"
							>
								<div class="flex items-center gap-2">
									{#if item.checked}
										<span class="w-3 text-[10px] font-bold">✓</span>
									{:else}
										<span class="w-3"></span>
									{/if}
									<span>{item.label}</span>
								</div>
								{#if item.shortcut}
									<span class="ml-4 text-[10px] text-[#808080] group-hover:text-white">
										{item.shortcut}
									</span>
								{/if}
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</nav>
