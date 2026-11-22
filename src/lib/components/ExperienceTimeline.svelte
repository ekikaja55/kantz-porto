<script lang="ts">
	import Icon from '@iconify/svelte';
	import { i18n } from '#lib/i18n/index.svelte';
	import type { Experience } from '#lib/server/db/schema';

	let { experiences = [] }: { experiences?: Experience[] } = $props();
</script>

<section id="experience" class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
	<div class="border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
		<h2 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
			{i18n.t.experience.title}
		</h2>
		<p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
			{i18n.t.experience.subtitle}
		</p>
	</div>

	<div class="mt-8 space-y-6">
		{#each experiences as exp (exp.id || exp.role + exp.company)}
			<div class="rounded-xl border border-neutral-200/90 bg-white p-6 shadow-xs transition-all hover:border-neutral-300 dark:border-neutral-800/90 dark:bg-neutral-900/60 dark:hover:border-neutral-700">
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
					<span class="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
						{exp.period}
					</span>
					<span class="text-xs font-medium text-neutral-600 dark:text-neutral-400">
						{exp.company}
					</span>
				</div>

				<h3 class="mt-2 font-display text-lg font-bold text-neutral-900 dark:text-white">
					{exp.role}
				</h3>

				<p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
					{exp.description}
				</p>

				{#if exp.highlights && exp.highlights.length > 0}
					<div class="mt-4 flex flex-wrap gap-2">
						{#each exp.highlights as item (item)}
							<span class="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
								<Icon icon="solar:check-circle-bold-duotone" class="size-3.5 text-emerald-500" />
								<span>{item}</span>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
