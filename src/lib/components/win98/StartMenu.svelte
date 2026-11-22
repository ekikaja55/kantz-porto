<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		open?: boolean;
		onclose?: () => void;
		onselectitem?: (id: string) => void;
	}

	let { open = false, onclose, onselectitem }: Props = $props();

	const menuItems = [
		{ id: 'projects', label: 'Projects (Explorer)', icon: 'projects', color: '#008080' },
		{ id: 'skills', label: 'Skills (Device Manager)', icon: 'skills', color: '#800080' },
		{ id: 'experiences', label: 'Experiences (HTML Help)', icon: 'experience', color: '#000080' },
		{ id: 'contact', label: 'Contact (Mail Client)', icon: 'contact', color: '#808000' }
	];

	function handleItemClick(id: string) {
		onselectitem?.(id);
		onclose?.();
	}
</script>

{#if open}
	<!-- Backdrop to close -->
	<div
		class="fixed inset-0 z-40 bg-transparent"
		role="presentation"
		onclick={onclose}
		onkeydown={(e) => e.key === 'Escape' && onclose?.()}
	></div>

	<!-- Start Menu Window -->
	<div
		class="win-raised fixed bottom-[34px] left-0 z-50 flex w-[240px] p-[2px] select-none text-black"
		role="menu"
		aria-label="Start Menu"
	>
		<!-- Left Vertical Banner -->
		<div
			class="flex items-end justify-center w-8 py-3 bg-gradient-to-t from-[#000080] to-[#1084D0] text-white shrink-0"
		>
			<span
				class="font-bold text-[15px] tracking-wider whitespace-nowrap -rotate-90 origin-center mb-8"
			>
				Kantz<span class="font-normal text-white/90"> OS</span>
			</span>
		</div>

		<!-- Menu List -->
		<div class="flex-1 py-1 bg-[#C0C0C0]">
			{#each menuItems as item (item.id)}
				<button
					type="button"
					role="menuitem"
					onclick={() => handleItemClick(item.id)}
					class="flex items-center w-full gap-2.5 px-3 py-1.5 text-left text-[12px] hover:win-selected group"
				>
					<Icon name={item.icon} size={24} color={item.color} />
					<span class="truncate font-medium">{item.label}</span>
				</button>
			{/each}

			<div class="my-1 border-t border-[#808080] border-b border-b-white mx-1"></div>

			<button
				type="button"
				role="menuitem"
				onclick={() => handleItemClick('readme')}
				class="flex items-center w-full gap-2.5 px-3 py-1.5 text-left text-[12px] hover:win-selected group"
			>
				<Icon name="document" size={24} color="#FFFFFF" />
				<span class="truncate">README.txt</span>
			</button>

			<button
				type="button"
				role="menuitem"
				onclick={() => handleItemClick('cv')}
				class="flex items-center w-full gap-2.5 px-3 py-1.5 text-left text-[12px] hover:win-selected group"
			>
				<Icon name="briefcase" size={24} color="#000080" />
				<span class="truncate font-bold">Download CV (PDF)</span>
			</button>

			<button
				type="button"
				role="menuitem"
				onclick={() => handleItemClick('settings')}
				class="flex items-center w-full gap-2.5 px-3 py-1.5 text-left text-[12px] hover:win-selected group"
			>
				<Icon name="settings" size={24} color="#000080" />
				<span class="truncate">Display Properties...</span>
			</button>

			<div class="my-1 border-t border-[#808080] border-b border-b-white mx-1"></div>

			<button
				type="button"
				role="menuitem"
				onclick={() => handleItemClick('shutdown')}
				class="flex items-center w-full gap-2.5 px-3 py-1.5 text-left text-[12px] hover:win-selected group"
			>
				<Icon name="shutdown" size={24} color="#800000" />
				<span class="truncate">Shut Down...</span>
			</button>
		</div>
	</div>
{/if}
