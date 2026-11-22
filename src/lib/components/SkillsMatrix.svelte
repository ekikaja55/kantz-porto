<script lang="ts">
	import Icon from '@iconify/svelte';
	import { i18n } from '#lib/i18n/index.svelte';
	import type { Skill } from '#lib/server/db/schema';

	let { skills = [] }: { skills?: Skill[] } = $props();

	const categoryMeta: Record<string, { title: string; icon: string }> = {
		languages: {
			title: 'Languages',
			icon: 'solar:code-file-bold-duotone'
		},
		frameworks: {
			title: 'Frameworks & Runtimes',
			icon: 'solar:widget-bold-duotone'
		},
		databases: {
			title: 'Databases & Infrastructure',
			icon: 'solar:database-bold-duotone'
		},
		systems: {
			title: 'Systems & Tooling',
			icon: 'solar:tuning-bold-duotone'
		}
	};

	let categories = $derived.by(() => {
		const order = ['languages', 'frameworks', 'databases', 'systems'];
		return order
			.map((key) => {
				const meta = categoryMeta[key] || { title: key, icon: 'solar:widget-bold-duotone' };
				const items = skills.filter((s) => s.category === key);
				return {
					key,
					title: meta.title,
					icon: meta.icon,
					skills: items.map((s) => s.name)
				};
			})
			.filter((c) => c.skills.length > 0);
	});
</script>

<section id="skills" class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
	<div class="border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
		<h2 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
			{i18n.t.skills.title}
		</h2>
		<p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
			{i18n.t.skills.subtitle}
		</p>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each categories as cat (cat.key)}
			<div class="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all hover:border-neutral-300 dark:border-neutral-800/90 dark:bg-neutral-900/60 dark:hover:border-neutral-700">
				<div class="flex items-center gap-2">
					<Icon icon={cat.icon} class="size-5 text-neutral-700 dark:text-neutral-300" />
					<h3 class="font-display text-base font-semibold text-neutral-900 dark:text-white">
						{cat.title}
					</h3>
				</div>

				<div class="mt-4 flex flex-wrap gap-1.5">
					{#each cat.skills as skill (skill)}
						<span class="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-mono text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
							{skill}
						</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>
