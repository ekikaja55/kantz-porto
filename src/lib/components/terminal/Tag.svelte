<script lang="ts">
	import type { Snippet } from 'svelte';

	type TagRole = 'ok' | 'warn' | 'muted' | 'special' | 'accent' | 'info' | 'danger';

	interface Props {
		role?: TagRole;
		text?: string;
		class?: string;
		children?: Snippet;
	}

	let { role = 'muted', text = '', class: className = '', children }: Props = $props();

	const roleClassMap: Record<TagRole, string> = {
		ok: 'text-term-ok',
		warn: 'text-term-warn',
		muted: 'text-term-muted',
		special: 'text-term-special',
		accent: 'text-term-accent',
		info: 'text-term-info',
		danger: 'text-term-danger'
	};
</script>

<span
	class="inline-block font-term-mono text-[15px] md:text-[16px] leading-[1.5] rounded-[2px] {roleClassMap[role]} {className}"
>
	[{#if children}{@render children()}{:else}{text}{/if}]
</span>
