<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'standard' | 'pressed' | 'tool';
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		variant = 'standard',
		children,
		class: className = '',
		disabled = false,
		onclick,
		type = 'button',
		...rest
	}: Props = $props();
</script>

<button
	{type}
	{disabled}
	{onclick}
	class="inline-flex items-center justify-center select-none px-3 py-1 text-black active:translate-x-[1px] active:translate-y-[1px] disabled:pointer-events-none disabled:text-[#808080] disabled:[text-shadow:1px_1px_0_#ffffff] focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-black focus-visible:-outline-offset-3 {variant ===
	'pressed'
		? 'win-pressed win-dither font-bold'
		: variant === 'tool'
			? 'win-raised-sm hover:win-raised active:win-sunken'
			: 'win-raised active:win-pressed'} {className}"
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</button>
