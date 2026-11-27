<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Project } from '#lib/server/db/schema';

	interface Props {
		projects: Project[];
	}

	let { projects }: Props = $props();

	function formatDate(d: Date | string | null | undefined): string {
		if (!d) return '----/--/--';
		try {
			return new Date(d).toISOString().slice(0, 10);
		} catch {
			return '----/--/--';
		}
	}

	function statusColorClass(status: string): string {
		const normalized = status.toLowerCase();
		if (normalized === 'live') return 'text-term-ok';
		if (normalized === 'wip' || normalized === 'in_progress' || normalized === 'in-progress') {
			return 'text-term-warn';
		}
		return 'text-term-muted';
	}

	function clickableRow(node: HTMLTableRowElement) {
		function handleClick(e: MouseEvent) {
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
			if ((e.target as HTMLElement | null)?.closest('a, button')) return;
			if (window.getSelection()?.toString()) return;
			node.querySelector<HTMLAnchorElement>('a[href]')?.click();
		}

		node.addEventListener('click', handleClick);
		return {
			destroy() {
				node.removeEventListener('click', handleClick);
			}
		};
	}
</script>

{#if projects.length === 0}
	<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-muted py-2">
		total 0
	</p>
{:else}
	<div class="overflow-x-auto">
		<table
			class="w-full border-collapse font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-left"
		>
			<thead class="hidden sm:table-header-group border-b border-term-border text-term-muted">
				<tr>
					<th scope="col" class="py-2.5 pl-2.5 pr-6 font-normal uppercase">TIER</th>
					<th scope="col" class="py-2.5 pr-6 font-normal uppercase">STATUS</th>
					<th scope="col" class="py-2.5 pr-6 font-normal uppercase">UPDATED</th>
					<th scope="col" class="py-2.5 font-normal uppercase">NAME</th>
				</tr>
			</thead>
			<tbody>
				{#each projects as project, idx (project.id)}
					<tr
						use:clickableRow
						style="--stagger: {idx};"
						class="term-tree-row term-stagger group block sm:table-row border-b border-term-border py-2.5 sm:py-0 cursor-pointer"
					>
						<td
							class="inline-block sm:table-cell pl-2.5 pr-3 sm:pr-6 py-1 sm:py-3 align-top text-term-muted group-hover:text-term-accent group-focus-within:text-term-accent whitespace-nowrap transition-colors duration-150"
						>
							T{project.tier}
						</td>
						<td
							class="inline-block sm:table-cell pr-3 sm:pr-6 py-1 sm:py-3 align-top {statusColorClass(
								project.status
							)} whitespace-nowrap"
						>
							[{project.status}]
						</td>
						<td
							class="inline-block sm:table-cell pr-3 sm:pr-6 py-1 sm:py-3 align-top text-term-muted tabular-nums whitespace-nowrap"
						>
							{formatDate(project.updatedAt)}
						</td>
						<td class="block sm:table-cell py-1 sm:py-3 pr-2.5 align-top">
							<a
								href={resolve('/(public)/projects/[slug]', { slug: project.slug })}
								class="inline-flex items-baseline underline hover:no-underline font-bold text-term-info group-hover:text-term-accent group-focus-within:text-term-accent"
							>
								<span
									aria-hidden="true"
									class="inline-block w-0 overflow-hidden opacity-0 group-hover:w-3.5 group-hover:opacity-100 group-focus-within:w-3.5 group-focus-within:opacity-100 transition-all duration-150 text-term-accent no-underline"
									>&gt;</span
								>
								<span>{project.title}</span>
							</a>
							<div
								class="text-[15px] md:text-[16px] leading-[1.5] text-term-muted group-hover:text-term-fg group-focus-within:text-term-fg transition-colors duration-150 mt-0.5"
							>
								{project.tagline}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
