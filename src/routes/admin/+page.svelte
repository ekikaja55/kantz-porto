<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Icon from '@iconify/svelte';
	import Modal from '#lib/components/Modal.svelte';
	import { toast } from '#lib/stores/toast.svelte';
	import type { PageProps } from './$types';
	import type { Project } from '#lib/server/db/schema';

	let { data }: PageProps = $props();

	let isDeleteModalOpen = $state(false);
	let projectToDelete = $state<Project | null>(null);
	let isDeleting = $state(false);

	function openDeleteModal(project: Project) {
		projectToDelete = project;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		projectToDelete = null;
	}
</script>

<svelte:head>
	<title>Dashboard Overview - Kantz Admin</title>
</svelte:head>

<div class="space-y-8">
	<!-- Top Bar -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
				Portfolio Overview
			</h1>
			<p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
				Monitor live visitor telemetry and manage dynamic project case studies.
			</p>
		</div>

		<a
			href={resolve('/admin/projects/new')}
			class="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			<Icon icon="solar:add-circle-bold-duotone" class="size-4" />
			<span>Add New Project</span>
		</a>
	</div>

	<!-- Analytics Metrics Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<!-- Total Pageviews Card -->
		<div class="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/60">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Pageviews</span>
				<div class="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
					<Icon icon="solar:eye-bold-duotone" class="size-4 text-neutral-700 dark:text-neutral-300" />
				</div>
			</div>
			<div class="mt-4 font-mono text-3xl font-bold text-neutral-900 dark:text-white">
				{data.analytics.totalViews.toLocaleString()}
			</div>
			<p class="mt-1 text-[11px] text-neutral-400">Server-side logged pageviews</p>
		</div>

		<!-- Unique Visitors Card -->
		<div class="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/60">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">24h Uniques</span>
				<div class="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
					<Icon icon="solar:users-group-rounded-bold-duotone" class="size-4 text-neutral-700 dark:text-neutral-300" />
				</div>
			</div>
			<div class="mt-4 font-mono text-3xl font-bold text-neutral-900 dark:text-white">
				{data.analytics.uniqueVisitorsToday.toLocaleString()}
			</div>
			<p class="mt-1 text-[11px] text-neutral-400">Unique client IPs recorded today</p>
		</div>

		<!-- Total Projects Card -->
		<div class="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/60">
			<div class="flex items-center justify-between">
				<span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total Projects</span>
				<div class="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
					<Icon icon="solar:folder-with-files-bold-duotone" class="size-4 text-neutral-700 dark:text-neutral-300" />
				</div>
			</div>
			<div class="mt-4 font-mono text-3xl font-bold text-neutral-900 dark:text-white">
				{data.projects.length}
			</div>
			<p class="mt-1 text-[11px] text-neutral-400">
				{data.projects.filter((p) => p.isPublished).length} published live
			</p>
		</div>
	</div>

	<!-- Top Viewed Projects Telemetry Bar (if any) -->
	{#if data.analytics.topProjects.length > 0}
		<div class="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/60">
			<div class="flex items-center gap-2">
				<Icon icon="solar:chart-2-bold-duotone" class="size-4 text-neutral-600 dark:text-neutral-400" />
				<h2 class="font-display text-sm font-bold text-neutral-900 dark:text-white">
					Top Projects Telemetry
				</h2>
			</div>

			<div class="mt-3 flex flex-wrap gap-2">
				{#each data.analytics.topProjects as stat (stat.slug)}
					<div class="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs dark:border-neutral-800 dark:bg-neutral-950">
						<span class="font-mono font-medium text-neutral-800 dark:text-neutral-200">{stat.slug}</span>
						<span class="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
							{stat.views} views
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Projects Management Table -->
	<div class="rounded-xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden dark:border-neutral-800/90 dark:bg-neutral-900/60">
		<div class="border-b border-neutral-200/90 p-4 sm:p-5 dark:border-neutral-800/90">
			<h2 class="font-display text-base font-bold text-neutral-900 dark:text-white">
				Project Case Studies Management
			</h2>
			<p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
				List of all projects stored in database. Toggle visibility or edit details.
			</p>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="border-b border-neutral-200 bg-neutral-50 font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
					<tr>
						<th class="py-3 px-4">Title & Slug</th>
						<th class="py-3 px-4">Category</th>
						<th class="py-3 px-4">Tier</th>
						<th class="py-3 px-4">Status</th>
						<th class="py-3 px-4 text-center">Visibility</th>
						<th class="py-3 px-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/80">
					{#each data.projects as project (project.id)}
						<tr class="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
							<td class="py-3.5 px-4">
								<div class="font-semibold text-neutral-900 dark:text-white">
									{project.title}
								</div>
								<div class="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
									/{project.slug}
								</div>
							</td>

							<td class="py-3.5 px-4">
								<span class="inline-block rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
									{project.category}
								</span>
							</td>

							<td class="py-3.5 px-4">
								{#if project.tier === 1}
									<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
										<Icon icon="solar:star-bold" class="size-3.5" />
										<span>Tier 1</span>
									</span>
								{:else}
									<span class="text-neutral-500 dark:text-neutral-400">
										Tier 2
									</span>
								{/if}
							</td>

							<td class="py-3.5 px-4">
								<span
									class={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
										project.status === 'live'
											? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
											: project.status === 'in-progress'
												? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
												: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
									}`}
								>
									{project.status}
								</span>
							</td>

							<td class="py-3.5 px-4 text-center">
								<form method="POST" action="?/togglePublished" use:enhance>
									<input type="hidden" name="id" value={project.id} />
									<button
										type="submit"
										title="Click to toggle publication"
										class={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-[11px] transition-colors ${
											project.isPublished
												? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
												: 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
										}`}
									>
										<span class={`size-1.5 rounded-full ${project.isPublished ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
										<span>{project.isPublished ? 'Published' : 'Draft'}</span>
									</button>
								</form>
							</td>

							<td class="py-3.5 px-4 text-right">
								<div class="inline-flex items-center gap-1.5">
									<a
										href={resolve('/(public)/projects/[slug]', { slug: project.slug })}
										target="_blank"
										rel="external noopener noreferrer"
										title="View live case study"
										class="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
									>
										<Icon icon="solar:arrow-right-up-bold-duotone" class="size-4" />
									</a>

									<a
										href={resolve('/admin/projects/[id]/edit', { id: project.id })}
										title="Edit project"
										class="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
									>
										<Icon icon="solar:pen-bold-duotone" class="size-4" />
									</a>

									<button
										type="button"
										onclick={() => openDeleteModal(project)}
										title="Delete project"
										class="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
									>
										<Icon icon="solar:trash-bin-trash-bold-duotone" class="size-4" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="border-t border-neutral-200 bg-neutral-50/50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/40">
			<a
				href={resolve('/admin/projects')}
				class="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
			>
				<span>Open Full Projects Management</span>
				<Icon icon="solar:arrow-right-bold-duotone" class="size-3.5" />
			</a>
		</div>
	</div>
</div>

<!-- Accessible Delete Confirmation Modal -->
<Modal
	bind:open={isDeleteModalOpen}
	title="Delete Project Case Study"
	onClose={closeDeleteModal}
>
	<p class="text-sm text-neutral-600 dark:text-neutral-300">
		Are you sure you want to permanently delete
		<strong class="font-semibold text-neutral-900 dark:text-white">
			"{projectToDelete?.title}"
		</strong>? This action cannot be undone.
	</p>

	{#snippet footer()}
		<button
			type="button"
			onclick={closeDeleteModal}
			class="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
		>
			Cancel
		</button>

		<form
			method="POST"
			action="?/deleteProject"
			use:enhance={() => {
				isDeleting = true;
				return async ({ update }) => {
					isDeleting = false;
					closeDeleteModal();
					await update();
					toast.success('Project deleted successfully.');
				};
			}}
		>
			<input type="hidden" name="id" value={projectToDelete?.id} />
			<button
				type="submit"
				disabled={isDeleting}
				class="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 disabled:opacity-50"
			>
				{#if isDeleting}
					<Icon icon="solar:refresh-bold-duotone" class="size-3.5 animate-spin" />
					<span>Deleting...</span>
				{:else}
					<Icon icon="solar:trash-bin-trash-bold-duotone" class="size-3.5" />
					<span>Delete Project</span>
				{/if}
			</button>
		</form>
	{/snippet}
</Modal>
