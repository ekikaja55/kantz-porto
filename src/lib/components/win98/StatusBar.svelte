<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string;
		children?: Snippet;
		class?: string;
	}

	let { text = 'Ready', children, class: className = '' }: Props = $props();
</script>

<footer class="flex items-center gap-1 text-[11px] select-none text-black {className}">
	{#if children}
		{@render children()}
	{:else}
		<div class="win-sunken-sm flex-1 px-2 py-0.5 truncate">
			{text}
		</div>
	{/if}
</footer>
