<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		key?: string;
		class?: string;
		children?: Snippet;
	}

	let { key = '', class: className = '', children }: Props = $props();
</script>

<kbd
	class="inline-flex items-center px-2 py-0.5 text-[14px] md:text-[15px] font-term-mono border border-term-border rounded-[2px] bg-term-surface text-term-fg leading-none {className}"
>
	{#if children}{@render children()}{:else}{key}{/if}
</kbd>
