<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import Modal from '#lib/components/Modal.svelte';
	import { toast } from '#lib/stores/toast.svelte';
	import type { PageProps } from './$types';
	import type { Experience } from '#lib/server/db/schema';

	let { data }: PageProps = $props();

	// Add Modal State
	let isAddModalOpen = $state(false);
	let isCreating = $state(false);

	// Edit Modal State
	let isEditModalOpen = $state(false);
	let editingExp = $state<Experience | null>(null);
	let isUpdating = $state(false);

	// Delete Modal State
	let isDeleteModalOpen = $state(false);
	let deletingExp = $state<Experience | null>(null);
	let isDeleting = $state(false);

	function openEditModal(exp: Experience) {
		editingExp = exp;
		isEditModalOpen = true;
	}

	function openDeleteModal(exp: Experience) {
		deletingExp = exp;
		isDeleteModalOpen = true;
	}
</script>

<svelte:head>
	<title>Experience Milestones - Kantz Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
				Experience Milestones
			</h1>
			<p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
				Manage career progression, engineering roles, and landmark project achievements.
			</p>
		</div>

		<button
			type="button"
			onclick={() => (isAddModalOpen = true)}
			class="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			<Icon icon="solar:add-circle-bold-duotone" class="size-4" />
			<span>Add Experience</span>
		</button>
	</div>

	<!-- Experiences List -->
	<div class="space-y-4">
		{#each data.experiences as exp (exp.id)}
			<div class="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all hover:border-neutral-300 dark:border-neutral-800/90 dark:bg-neutral-900/60 dark:hover:border-neutral-700">
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
					<div>
						<div class="flex items-center gap-2">
							<span class="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
								{exp.period}
							</span>
							<span class="text-neutral-300 dark:text-neutral-700">|</span>
							<span class="text-xs font-medium text-neutral-700 dark:text-neutral-300">
								{exp.company}
							</span>
						</div>
						<h3 class="mt-1 font-display text-base font-bold text-neutral-900 dark:text-white">
							{exp.role}
						</h3>
					</div>

					<div class="flex items-center gap-1.5 self-end sm:self-center">
						<span class="mr-2 font-mono text-[11px] text-neutral-400">Order: #{exp.orderIndex}</span>
						<button
							type="button"
							onclick={() => openEditModal(exp)}
							aria-label="Edit {exp.role}"
							class="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
						>
							<Icon icon="solar:pen-bold-duotone" class="size-4" />
						</button>
						<button
							type="button"
							onclick={() => openDeleteModal(exp)}
							aria-label="Delete {exp.role}"
							class="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
						>
							<Icon icon="solar:trash-bin-trash-bold-duotone" class="size-4" />
						</button>
					</div>
				</div>

				<p class="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
					{exp.description}
				</p>

				{#if exp.highlights && exp.highlights.length > 0}
					<div class="mt-3 flex flex-wrap gap-2">
						{#each exp.highlights as item (item)}
							<span class="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
								<Icon icon="solar:check-circle-bold-duotone" class="size-3.5 text-emerald-500" />
								<span>{item}</span>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-xs text-neutral-400 dark:border-neutral-800">
				No experience milestones found.
			</div>
		{/each}
	</div>
</div>

<!-- Add Experience Modal -->
<Modal bind:open={isAddModalOpen} title="Add Experience Milestone">
	<form
		id="add-exp-form"
		method="POST"
		action="?/createExperience"
		use:enhance={() => {
			isCreating = true;
			return async ({ update }) => {
				isCreating = false;
				isAddModalOpen = false;
				await update();
				toast.success('Experience milestone added successfully.');
			};
		}}
		class="space-y-4"
	>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="new-exp-period" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Period *
					</label>
					<input
						type="text"
						id="new-exp-period"
						name="period"
						required
						placeholder="e.g. 2025 — PRESENT"
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm font-mono text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>

				<div>
					<label for="new-exp-company" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Company / Organization *
					</label>
					<input
						type="text"
						id="new-exp-company"
						name="company"
						required
						placeholder="e.g. Freelance / Independent"
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>
			</div>

			<div>
				<label for="new-exp-role" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Job Role / Title *
				</label>
				<input
					type="text"
					id="new-exp-role"
					name="role"
					required
					placeholder="e.g. Software Engineer & Fullstack Developer"
					class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				/>
			</div>

			<div>
				<label for="new-exp-desc" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Role Description *
				</label>
				<textarea
					id="new-exp-desc"
					name="description"
					rows="3"
					required
					placeholder="Summary of responsibilities and technical accomplishments..."
					class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				></textarea>
			</div>

			<div>
				<label for="new-exp-highlights" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Key Highlights (One per line)
				</label>
				<textarea
					id="new-exp-highlights"
					name="highlights"
					rows="3"
					placeholder="MLBB Voice Timer (Speech NLP HUD)&#10;Invoizy (Automated Order-to-Invoice SaaS)"
					class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 font-mono text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				></textarea>
			</div>

			<div>
				<label for="new-exp-order" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Display Order Index
				</label>
				<input
					type="number"
					id="new-exp-order"
					name="orderIndex"
					value="10"
					class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 font-mono text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				/>
			</div>
		</form>

	{#snippet footer()}
		<button
			type="button"
			onclick={() => (isAddModalOpen = false)}
			class="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
		>
			Cancel
		</button>
		<button
			type="submit"
			form="add-exp-form"
			disabled={isCreating}
			class="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			{#if isCreating}
				<Icon icon="solar:refresh-bold-duotone" class="size-3.5 animate-spin" />
				<span>Saving...</span>
			{:else}
				<Icon icon="solar:check-circle-bold-duotone" class="size-3.5" />
				<span>Save Experience</span>
			{/if}
		</button>
	{/snippet}
</Modal>

<!-- Edit Experience Modal -->
<Modal bind:open={isEditModalOpen} title="Edit Experience Milestone">
	{#if editingExp}
		<form
			id="edit-exp-form"
				method="POST"
				action="?/updateExperience"
				use:enhance={() => {
					isUpdating = true;
					return async ({ update }) => {
						isUpdating = false;
						isEditModalOpen = false;
						await update();
						toast.success('Experience milestone updated successfully.');
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id" value={editingExp.id} />

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label for="edit-exp-period" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
							Period *
						</label>
						<input
							type="text"
							id="edit-exp-period"
							name="period"
							required
							value={editingExp.period}
							class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm font-mono text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
						/>
					</div>

					<div>
						<label for="edit-exp-company" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
							Company / Organization *
						</label>
						<input
							type="text"
							id="edit-exp-company"
							name="company"
							required
							value={editingExp.company}
							class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
						/>
					</div>
				</div>

				<div>
					<label for="edit-exp-role" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Job Role / Title *
					</label>
					<input
						type="text"
						id="edit-exp-role"
						name="role"
						required
						value={editingExp.role}
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>

				<div>
					<label for="edit-exp-desc" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Role Description *
					</label>
					<textarea
						id="edit-exp-desc"
						name="description"
						rows="3"
						required
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					>{editingExp.description}</textarea>
				</div>

				<div>
					<label for="edit-exp-highlights" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Key Highlights (One per line)
					</label>
					<textarea
						id="edit-exp-highlights"
						name="highlights"
						rows="3"
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 font-mono text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					>{editingExp.highlights ? editingExp.highlights.join('\n') : ''}</textarea>
				</div>

				<div>
					<label for="edit-exp-order" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Display Order Index
					</label>
					<input
						type="number"
						id="edit-exp-order"
						name="orderIndex"
						value={editingExp.orderIndex}
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 font-mono text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>
			</form>
		{/if}

	{#snippet footer()}
		<button
			type="button"
			onclick={() => (isEditModalOpen = false)}
			class="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
		>
			Cancel
		</button>
		<button
			type="submit"
			form="edit-exp-form"
			disabled={isUpdating}
			class="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			{#if isUpdating}
				<Icon icon="solar:refresh-bold-duotone" class="size-3.5 animate-spin" />
				<span>Updating...</span>
			{:else}
				<Icon icon="solar:check-circle-bold-duotone" class="size-3.5" />
				<span>Update Experience</span>
			{/if}
		</button>
	{/snippet}
</Modal>

<!-- Delete Experience Modal -->
<Modal bind:open={isDeleteModalOpen} title="Delete Experience Milestone">
	<p class="text-sm text-neutral-600 dark:text-neutral-300">
		Are you sure you want to delete <strong class="font-semibold text-neutral-900 dark:text-white">"{deletingExp?.role} at {deletingExp?.company}"</strong>? This will remove it from the timeline.
	</p>

	{#snippet footer()}
		<button
			type="button"
			onclick={() => (isDeleteModalOpen = false)}
			class="rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
		>
			Cancel
		</button>
		<form
			method="POST"
			action="?/deleteExperience"
			use:enhance={() => {
				isDeleting = true;
				return async ({ update }) => {
					isDeleting = false;
					isDeleteModalOpen = false;
					await update();
					toast.success('Experience milestone deleted successfully.');
				};
			}}
		>
			<input type="hidden" name="id" value={deletingExp?.id} />
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
					<span>Delete</span>
				{/if}
			</button>
		</form>
	{/snippet}
</Modal>
