<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		label: string;
		icon: string;
		iconColor?: string;
		selected?: boolean;
		onselect?: () => void;
		onopen?: () => void;
		class?: string;
	}

	let {
		label,
		icon,
		iconColor = '#FFFFFF',
		selected = false,
		onselect,
		onopen,
		class: className = ''
	}: Props = $props();

	let lastClickTime = 0;

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		const now = Date.now();
		if (selected || now - lastClickTime < 350) {
			onopen?.();
		} else {
			onselect?.();
		}
		lastClickTime = now;
	}

	function handleDblClick(e: MouseEvent) {
		e.stopPropagation();
		onopen?.();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onopen?.();
		}
	}
</script>

<button
	type="button"
	onclick={handleClick}
	ondblclick={handleDblClick}
	onkeydown={handleKeyDown}
	class="flex flex-col items-center justify-start w-[84px] p-2 select-none text-center cursor-pointer group bg-transparent border-0 focus:outline-none focus-visible:win-focus-dotted {className}"
	aria-pressed={selected}
>
	<!-- Icon with desktop drop shadow -->
	<div class="mb-1 transition-transform group-active:translate-y-[1px]">
		<Icon name={icon} size={36} color={iconColor} desktopShadow={true} />
	</div>

	<!-- Label -->
	<span
		class="text-[12px] px-1 py-0.5 line-clamp-2 leading-tight break-words {selected
			? 'win-selected win-focus-dotted'
			: 'text-white [text-shadow:1px_1px_0_#000000]'}"
	>
		{label}
	</span>
</button>
