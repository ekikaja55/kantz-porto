<script lang="ts">
	import type { Snippet } from 'svelte';
	import TermIcon from './TermIcon.svelte';

	export interface KeyValueItem {
		key: string;
		value?: string | number | null;
		values?: string[];
		href?: string;
		external?: boolean;
		copyable?: boolean;
	}

	interface Props {
		key?: string;
		value?: string | number | null;
		values?: string[];
		href?: string;
		external?: boolean;
		copyable?: boolean;
		items?: KeyValueItem[];
		oncopy?: (text: string, key?: string) => void;
		class?: string;
		children?: Snippet;
	}

	let {
		key,
		value,
		values,
		href,
		external,
		copyable,
		items = [],
		oncopy,
		class: className = '',
		children
	}: Props = $props();

	let copiedKey = $state<string | null>(null);

	let displayItems = $derived(
		key !== undefined ? [{ key, value, values, href, external, copyable }] : items
	);

	async function handleCopy(itemKey: string, text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copiedKey = itemKey;
			oncopy?.(text, itemKey);
			setTimeout(() => {
				if (copiedKey === itemKey) copiedKey = null;
			}, 2000);
		} catch {
			// Clipboard write failed or unavailable
		}
	}
</script>

<dl class="space-y-2 text-[16px] md:text-[18px] leading-[1.6] font-term-mono {className}">
	{#if children}
		{@render children()}
	{/if}

	{#each displayItems as item (item.key)}
		<div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-0.5">
			<dt class="text-term-muted">{item.key}</dt>
			<dd class="min-w-0 text-term-fg break-words flex items-center gap-2 flex-wrap">
				{#if item.href}
					<a
						href={item.href}
						target={item.external ? '_blank' : undefined}
						rel="external noopener noreferrer"
						class="text-term-info underline hover:text-term-accent inline-flex items-center gap-1 min-w-0 max-w-full break-words"
					>
						<span class="min-w-0 break-words">{item.value ?? item.href}</span>
						{#if item.external}
							<TermIcon name="external-link" size={14} class="shrink-0" />
						{/if}
					</a>
				{:else if item.values}
					<span>{item.values.join(', ')}</span>
				{:else}
					<span>{item.value ?? '-'}</span>
				{/if}

				{#if item.copyable && item.value}
					<button
						type="button"
						onclick={() => handleCopy(item.key, String(item.value))}
						class="p-1 border transition-colors duration-150 cursor-pointer {copiedKey === item.key
							? 'border-term-ok/60 bg-term-ok/10 text-term-ok'
							: 'border-transparent text-term-muted hover:text-term-accent hover:border-term-border'}"
						aria-label="Copy {item.key}"
					>
						{#if copiedKey === item.key}
							<span class="term-copy-pop inline-flex">
								<TermIcon name="check" size={14} class="text-term-ok" />
							</span>
						{:else}
							<TermIcon name="copy" size={14} />
						{/if}
					</button>
				{/if}
			</dd>
		</div>
	{/each}
</dl>
