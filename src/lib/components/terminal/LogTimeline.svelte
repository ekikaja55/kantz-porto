<script lang="ts">
	import type { Experience } from '#lib/server/db/schema';

	interface Props {
		experiences: Experience[];
	}

	let { experiences }: Props = $props();

	let sorted = $derived([...experiences].sort((a, b) => a.orderIndex - b.orderIndex));

	function shortCommitHash(id: string): string {
		const compact = id.replace(/-/g, '').toLowerCase();
		if (/^[0-9a-f]{7,}$/.test(compact)) {
			return compact.slice(0, 7);
		}
		let hash = 0x811c9dc5;
		for (let i = 0; i < id.length; i++) {
			hash ^= id.charCodeAt(i);
			hash = Math.imul(hash, 0x01000193);
		}
		return (hash >>> 0).toString(16).padStart(8, '0').slice(0, 7);
	}

	function formatPeriod(period: string): string {
		return period.replace(/[\u2012\u2013\u2014\u2015]/g, '-');
	}
</script>

{#if sorted.length === 0}
	<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-muted py-2">
		no experience records yet
	</p>
{:else}
	<ol class="font-term-mono text-[16px] md:text-[18px] leading-[1.6] space-y-8">
		{#each sorted as exp, idx (exp.id)}
			<li
				style="--stagger: {idx};"
				class="term-log-entry term-timeline-rail term-stagger relative pl-6 py-1 pr-3 -my-1 space-y-2.5 hover:bg-term-surface/55 transition-colors duration-150"
			>
				{#if idx === 0}
					<span class="absolute -left-[4px] top-[11px] flex items-center justify-center select-none" aria-hidden="true">
						<span class="term-pulse-dot" style="--dot-color: var(--t-accent);"></span>
					</span>
				{:else}
					<span
						class="absolute -left-[6px] top-1 text-term-accent font-bold select-none"
						aria-hidden="true">*</span
					>
				{/if}
				<div
					class="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[15px] md:text-[17px] leading-[1.5]"
				>
					<span class="text-term-accent font-bold tabular-nums">{shortCommitHash(exp.id)}</span>
					{#if idx === 0}
						<span class="text-term-ok text-[13px] md:text-[14px]">(HEAD)</span>
					{/if}
					<span class="text-term-info text-[14px] md:text-[15px]">({formatPeriod(exp.period)})</span
					>
					<span class="font-bold text-term-fg">{exp.role}</span>
					<span class="text-term-special">@ {exp.company}</span>
				</div>
				<p class="text-term-fg max-w-[72ch]">
					{exp.description}
				</p>
				{#if exp.highlights && exp.highlights.length > 0}
					<ul class="space-y-1 text-term-muted text-[15px] md:text-[16px] leading-[1.55]">
						{#each exp.highlights as item, hIdx (hIdx)}
							<li><span class="text-term-faint">-</span> {item}</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ol>
{/if}
