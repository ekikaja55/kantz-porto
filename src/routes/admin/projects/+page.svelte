<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Icon from '@iconify/svelte';
	import Modal from '#lib/components/Modal.svelte';
	import { toast } from '#lib/stores/toast.svelte';
	import type { PageProps } from './$types';
	import type { Project } from '#lib/server/db/schema';

	let { data }: PageProps = $props();

	let searchQuery = $state('');
	let currentPage = $state(1);
	const itemsPerPage = 5;

	// Modal State
	let isDeleteModalOpen = $state(false);
	let projectToDelete = $state<Project | null>(null);
	let isDeleting = $state(false);

	let filteredProjects = $derived.by(() => {
		const q = searchQuery.toLowerCase().trim();
		if (!q) return data.projects;
		return data.projects.filter(
			(p) =>
				p.title.toLowerCase().includes(q) ||
				p.slug.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q)
		);
	});

	let totalPages = $derived(Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage)));

	let paginatedProjects = $derived.by(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredProjects.slice(start, start + itemsPerPage);
	});

	function openDeleteModal(project: Project) {
		projectToDelete = project;
		isDeleteModalOpen = true;
	}

	function closeDeleteModal() {
		isDeleteModalOpen = false;
		projectToDelete = null;
	}

	let isFiltered = $derived(searchQuery.trim().length > 0);

	function isFirst(project: Project): boolean {
		return data.projects[0]?.id === project.id;
	}

	function isLast(project: Project): boolean {
		return data.projects[data.projects.length - 1]?.id === project.id;
	}
</script>

<svelte:head>
	<title>Projects Management - Kantz Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
				Project Case Studies
			</h1>
			<p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
				Manage engineering case studies, upload WebP screenshots, and control publication visibility.
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

	<!-- Filter / Search Toolbar -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-neutral-200/90 bg-white p-3 shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/60">
		<div class="relative flex-1 max-w-sm">
			<Icon icon="solar:magnifer-bold-duotone" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
			<input
				type="search"
				placeholder="Search projects by title, slug, or category..."
				bind:value={searchQuery}
				oninput={() => (currentPage = 1)}
				class="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-9 pr-3 text-xs text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
			/>
		</div>

		<div class="flex items-center gap-2 text-xs font-mono text-neutral-500">
			<span>Showing {paginatedProjects.length} of {filteredProjects.length} items</span>
		</div>
	</div>

	<!-- Projects Table -->
	<div class="overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/60">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs">
				<thead class="border-b border-neutral-200 bg-neutral-50 font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
					<tr>
						<th class="py-3 px-3 text-center w-20">Order</th>
						<th class="py-3 px-4">Title & Slug</th>
						<th class="py-3 px-4">Category</th>
						<th class="py-3 px-4">Tier</th>
						<th class="py-3 px-4">Screenshots</th>
						<th class="py-3 px-4">Status</th>
						<th class="py-3 px-4 text-center">Visibility</th>
						<th class="py-3 px-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/80">
					{#each paginatedProjects as project (project.id)}
						<tr class="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
							<td class="py-3.5 px-3 text-center">
								<div class="inline-flex items-center gap-1.5">
									<span class="w-5 font-mono text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
										#{project.orderIndex}
									</span>
									<div class="flex flex-col gap-0.5">
										<form
											method="POST"
											action="?/reorder"
											use:enhance={() => {
												return async ({ update }) => {
													await update();
													toast.info(`Moved ${project.title} up`);
												};
											}}
										>
											<input type="hidden" name="id" value={project.id} />
											<input type="hidden" name="direction" value="up" />
											<button
												type="submit"
												aria-label={`Move ${project.title} up`}
												title={isFiltered ? 'Clear search to reorder' : 'Move up'}
												disabled={isFiltered || isFirst(project)}
												class="rounded p-0.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-20 disabled:cursor-not-allowed dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
											>
												<Icon icon="solar:alt-arrow-up-linear" class="size-3" />
											</button>
										</form>
										<form
											method="POST"
											action="?/reorder"
											use:enhance={() => {
												return async ({ update }) => {
													await update();
													toast.info(`Moved ${project.title} down`);
												};
											}}
										>
											<input type="hidden" name="id" value={project.id} />
											<input type="hidden" name="direction" value="down" />
											<button
												type="submit"
												aria-label={`Move ${project.title} down`}
												title={isFiltered ? 'Clear search to reorder' : 'Move down'}
												disabled={isFiltered || isLast(project)}
												class="rounded p-0.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-20 disabled:cursor-not-allowed dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
											>
												<Icon icon="solar:alt-arrow-down-linear" class="size-3" />
											</button>
										</form>
									</div>
								</div>
							</td>

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
								<span class="font-mono text-neutral-600 dark:text-neutral-400">
									{project.images ? project.images.length : 0}/3
								</span>
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
								<form
									method="POST"
									action="?/togglePublished"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
											toast.info(`Updated visibility for ${project.title}`);
										};
									}}
								>
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
					{:else}
						<tr>
							<td colspan="7" class="py-8 text-center text-xs text-neutral-400">
								No projects match your search query.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination Footer -->
		{#if totalPages > 1}
			<div class="flex items-center justify-between border-t border-neutral-200 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/40">
				<div class="text-xs font-mono text-neutral-500">
					Page {currentPage} of {totalPages}
				</div>

				<div class="flex items-center gap-1.5">
					<button
						type="button"
						disabled={currentPage <= 1}
						onclick={() => (currentPage = Math.max(1, currentPage - 1))}
						class="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
					>
						<Icon icon="solar:alt-arrow-left-bold-duotone" class="size-3.5" />
						<span>Previous</span>
					</button>

					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
						<button
							type="button"
							onclick={() => (currentPage = pageNum)}
							class="size-7 rounded-md text-xs font-medium transition-colors
								{currentPage === pageNum
								? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
								: 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'}"
						>
							{pageNum}
						</button>
					{/each}

					<button
						type="button"
						disabled={currentPage >= totalPages}
						onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
						class="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
					>
						<span>Next</span>
						<Icon icon="solar:alt-arrow-right-bold-duotone" class="size-3.5" />
					</button>
				</div>
			</div>
		{/if}
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
		</strong>? This action will remove the case study and cannot be undone.
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
