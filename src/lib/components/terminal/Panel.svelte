<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		active?: boolean;
		titleClass?: string;
		paddingClass?: string;
		style?: string;
		class?: string;
		children: Snippet;
	}

	let {
		title,
		active = false,
		titleClass = 'text-term-fg',
		paddingClass = 'p-5 sm:p-6',
		style,
		class: className = '',
		children
	}: Props = $props();
</script>

<fieldset {style} class="border border-term-border {paddingClass} mb-5 {className}">
	<legend
		class="px-2.5 text-[15px] md:text-[17px] leading-[1.5] font-term-mono font-bold {active
			? 'bg-term-accent text-term-bg'
			: titleClass}"
	>
		{title}
	</legend>
	{@render children()}
</fieldset>
