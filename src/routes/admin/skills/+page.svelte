<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import Modal from '#lib/components/Modal.svelte';
	import { toast } from '#lib/stores/toast.svelte';
	import type { PageProps } from './$types';
	import type { Skill } from '#lib/server/db/schema';

	let { data }: PageProps = $props();

	let selectedCategory = $state<string>('all');
	let searchQuery = $state('');

	// Add Modal State
	let isAddModalOpen = $state(false);
	let isCreating = $state(false);

	// Edit Modal State
	let isEditModalOpen = $state(false);
	let editingSkill = $state<Skill | null>(null);
	let isUpdating = $state(false);

	// Delete Modal State
	let isDeleteModalOpen = $state(false);
	let deletingSkill = $state<Skill | null>(null);
	let isDeleting = $state(false);

	const categories = [
		{ key: 'all', label: 'All Categories' },
		{ key: 'languages', label: 'Languages' },
		{ key: 'frameworks', label: 'Frameworks' },
		{ key: 'databases', label: 'Databases' },
		{ key: 'systems', label: 'Systems & Tools' }
	];

	let filteredSkills = $derived.by(() => {
		let list = data.skills;
		if (selectedCategory !== 'all') {
			list = list.filter((s) => s.category === selectedCategory);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			list = list.filter((s) => s.name.toLowerCase().includes(q));
		}
		return list;
	});

	function openEditModal(skill: Skill) {
		editingSkill = skill;
		isEditModalOpen = true;
	}

	function openDeleteModal(skill: Skill) {
		deletingSkill = skill;
		isDeleteModalOpen = true;
	}
</script>

<svelte:head>
	<title>Technical Capabilities - Kantz Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
				Technical Capabilities
			</h1>
			<p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
				Manage engineering languages, frameworks, infrastructure, and systems skills.
			</p>
		</div>

		<button
			type="button"
			onclick={() => (isAddModalOpen = true)}
			class="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			<Icon icon="solar:add-circle-bold-duotone" class="size-4" />
			<span>Add Capability</span>
		</button>
	</div>

	<!-- Controls Toolbar -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-neutral-200/90 bg-white p-3 shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/60">
		<!-- Category Filter Tabs -->
		<div class="flex flex-wrap gap-1">
			{#each categories as cat (cat.key)}
				<button
					type="button"
					onclick={() => (selectedCategory = cat.key)}
					class="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors
						{selectedCategory === cat.key
						? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
						: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'}"
				>
					{cat.label}
				</button>
			{/each}
		</div>

		<!-- Search Input -->
		<div class="relative max-w-xs w-full">
			<Icon icon="solar:magnifer-bold-duotone" class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
			<input
				type="search"
				placeholder="Search skills..."
				bind:value={searchQuery}
				class="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-1 pl-8 pr-3 text-xs text-neutral-900 focus:border-neutral-400 focus:bg-white focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
			/>
		</div>
	</div>

	<!-- Skills Grid / List -->
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each filteredSkills as skill (skill.id)}
			<div class="flex items-center justify-between rounded-xl border border-neutral-200/90 bg-white p-4 shadow-xs transition-all hover:border-neutral-300 dark:border-neutral-800/90 dark:bg-neutral-900/60 dark:hover:border-neutral-700">
				<div class="flex items-center gap-3">
					<div class="flex size-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
						<Icon icon={skill.icon || 'solar:code-square-bold-duotone'} class="size-4.5 text-neutral-700 dark:text-neutral-300" />
					</div>
					<div>
						<h3 class="font-semibold text-sm text-neutral-900 dark:text-white">{skill.name}</h3>
						<div class="flex items-center gap-2 mt-0.5">
							<span class="rounded bg-neutral-100 px-1.5 py-0.2 font-mono text-[10px] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-400">
								{skill.category}
							</span>
							<span class="font-mono text-[10px] text-neutral-400">#{skill.orderIndex}</span>
						</div>
					</div>
				</div>

				<div class="flex items-center gap-1">
					<button
						type="button"
						onclick={() => openEditModal(skill)}
						aria-label="Edit {skill.name}"
						class="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
					>
						<Icon icon="solar:pen-bold-duotone" class="size-4" />
					</button>

					<button
						type="button"
						onclick={() => openDeleteModal(skill)}
						aria-label="Delete {skill.name}"
						class="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
					>
						<Icon icon="solar:trash-bin-trash-bold-duotone" class="size-4" />
					</button>
				</div>
			</div>
		{:else}
			<div class="col-span-full py-12 text-center text-xs text-neutral-400">
				No skills found for the selected category and search criteria.
			</div>
		{/each}
	</div>
</div>

<!-- Add Skill Modal -->
<Modal bind:open={isAddModalOpen} title="Add Technical Capability">
	<form
		id="add-skill-form"
		method="POST"
		action="?/createSkill"
		use:enhance={() => {
			isCreating = true;
			return async ({ update }) => {
				isCreating = false;
				isAddModalOpen = false;
				await update();
				toast.success('Skill added successfully.');
			};
		}}
		class="space-y-4"
	>
			<div>
				<label for="new-skill-name" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Capability Name *
				</label>
				<input
					type="text"
					id="new-skill-name"
					name="name"
					required
					placeholder="e.g. Rust, Docker, GraphQL"
					class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				/>
			</div>

			<div>
				<label for="new-skill-category" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Category *
				</label>
				<select
					id="new-skill-category"
					name="category"
					class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				>
					<option value="languages">Languages</option>
					<option value="frameworks">Frameworks & Runtimes</option>
					<option value="databases">Databases & Infrastructure</option>
					<option value="systems">Systems & Tooling</option>
				</select>
			</div>

			<div>
				<label for="new-skill-icon" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Solar Icon Identifier (Optional)
				</label>
				<input
					type="text"
					id="new-skill-icon"
					name="icon"
					placeholder="solar:code-file-bold-duotone"
					class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 font-mono text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				/>
			</div>

			<div>
				<label for="new-skill-order" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Display Order Index
				</label>
				<input
					type="number"
					id="new-skill-order"
					name="orderIndex"
					value="30"
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
			form="add-skill-form"
			disabled={isCreating}
			class="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			{#if isCreating}
				<Icon icon="solar:refresh-bold-duotone" class="size-3.5 animate-spin" />
				<span>Saving...</span>
			{:else}
				<Icon icon="solar:check-circle-bold-duotone" class="size-3.5" />
				<span>Save Capability</span>
			{/if}
		</button>
	{/snippet}
</Modal>

<!-- Edit Skill Modal -->
<Modal bind:open={isEditModalOpen} title="Edit Technical Capability">
	{#if editingSkill}
		<form
			id="edit-skill-form"
				method="POST"
				action="?/updateSkill"
				use:enhance={() => {
					isUpdating = true;
					return async ({ update }) => {
						isUpdating = false;
						isEditModalOpen = false;
						await update();
						toast.success('Skill updated successfully.');
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="id" value={editingSkill.id} />

				<div>
					<label for="edit-skill-name" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Capability Name *
					</label>
					<input
						type="text"
						id="edit-skill-name"
						name="name"
						required
						value={editingSkill.name}
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>

				<div>
					<label for="edit-skill-category" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Category *
					</label>
					<select
						id="edit-skill-category"
						name="category"
						value={editingSkill.category}
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					>
						<option value="languages">Languages</option>
						<option value="frameworks">Frameworks & Runtimes</option>
						<option value="databases">Databases & Infrastructure</option>
						<option value="systems">Systems & Tooling</option>
					</select>
				</div>

				<div>
					<label for="edit-skill-icon" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Solar Icon Identifier
					</label>
					<input
						type="text"
						id="edit-skill-icon"
						name="icon"
						value={editingSkill.icon || ''}
						class="mt-1 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 font-mono text-xs text-neutral-900 focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>

				<div>
					<label for="edit-skill-order" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Display Order Index
					</label>
					<input
						type="number"
						id="edit-skill-order"
						name="orderIndex"
						value={editingSkill.orderIndex}
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
			form="edit-skill-form"
			disabled={isUpdating}
			class="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
		>
			{#if isUpdating}
				<Icon icon="solar:refresh-bold-duotone" class="size-3.5 animate-spin" />
				<span>Updating...</span>
			{:else}
				<Icon icon="solar:check-circle-bold-duotone" class="size-3.5" />
				<span>Update Capability</span>
			{/if}
		</button>
	{/snippet}
</Modal>

<!-- Delete Skill Modal -->
<Modal bind:open={isDeleteModalOpen} title="Delete Capability">
	<p class="text-sm text-neutral-600 dark:text-neutral-300">
		Are you sure you want to delete <strong class="font-semibold text-neutral-900 dark:text-white">"{deletingSkill?.name}"</strong>? This will remove it from the capabilities matrix.
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
			action="?/deleteSkill"
			use:enhance={() => {
				isDeleting = true;
				return async ({ update }) => {
					isDeleting = false;
					isDeleteModalOpen = false;
					await update();
					toast.success('Skill deleted successfully.');
				};
			}}
		>
			<input type="hidden" name="id" value={deletingSkill?.id} />
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
