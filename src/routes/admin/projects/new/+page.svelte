<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Icon from '@iconify/svelte';
	import ProjectImageUploader from '#lib/components/ProjectImageUploader.svelte';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	let isSubmitting = $state(false);
	let title = $state('');
	let slug = $state('');
	let images = $state<string[]>([]);

	$effect(() => {
		if (form?.values?.title && !title) {
			title = form.values.title;
		}
		if (form?.values?.slug && !slug) {
			slug = form.values.slug;
		}
	});

	function handleTitleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		title = target.value;
		if (!slug) {
			slug = target.value
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)+/g, '');
		}
	}
</script>

<svelte:head>
	<title>Add New Project - Kantz Admin</title>
</svelte:head>

<div class="mx-auto max-w-3xl">
	<!-- Breadcrumb / Back Link -->
	<a
		href={resolve('/admin')}
		class="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
	>
		<Icon icon="solar:arrow-left-bold-duotone" class="size-4" />
		<span>Back to Dashboard</span>
	</a>

	<div class="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-neutral-800/90 dark:bg-neutral-900/70">
		<div class="border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
			<h1 class="font-display text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
				Add New Project Case Study
			</h1>
			<p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
				Define project metadata, technical architecture, and case study narrative.
			</p>
		</div>

		{#if form?.error}
			<div
				role="alert"
				class="mt-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
			>
				<Icon icon="solar:danger-triangle-bold-duotone" class="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
				<span class="leading-relaxed">{form.error}</span>
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="mt-6 space-y-6"
		>
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<!-- Title -->
				<div>
					<label for="title" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Project Title *
					</label>
					<input
						type="text"
						id="title"
						name="title"
						required
						bind:value={title}
						oninput={handleTitleChange}
						placeholder="e.g. Invoizy Desktop"
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>

				<!-- Slug -->
				<div>
					<label for="slug" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						URL Slug *
					</label>
					<input
						type="text"
						id="slug"
						name="slug"
						required
						bind:value={slug}
						placeholder="e.g. invoizy-desktop"
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm font-mono text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>
			</div>

			<!-- Tagline -->
			<div>
				<label for="tagline" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Tagline (Short Summary) *
				</label>
				<input
					type="text"
					id="tagline"
					name="tagline"
					required
					value={form?.values?.tagline || ''}
					placeholder="e.g. Offline-first POS & Invoice Management Desktop Application"
					class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
				<!-- Category -->
				<div>
					<label for="category" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Category
					</label>
					<select
						id="category"
						name="category"
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					>
						<option value="web">Web Application</option>
						<option value="mobile">Mobile Application</option>
						<option value="systems">Systems & Tools</option>
						<option value="game">Game & Graphics</option>
					</select>
				</div>

				<!-- Tier -->
				<div>
					<label for="tier" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Portfolio Tier
					</label>
					<select
						id="tier"
						name="tier"
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					>
						<option value="1">Tier 1 (Spotlight Featured)</option>
						<option value="2">Tier 2 (Engineering Archive)</option>
					</select>
				</div>

				<!-- Status -->
				<div>
					<label for="status" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Development Status
					</label>
					<select
						id="status"
						name="status"
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					>
						<option value="live">Live in Production</option>
						<option value="in-progress">In Active Development</option>
						<option value="archived">Archived / Legacy</option>
					</select>
				</div>
			</div>

			<!-- Technologies -->
			<div>
				<label for="technologies" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Technologies (Comma Separated)
				</label>
				<input
					type="text"
					id="technologies"
					name="technologies"
					value={form?.values?.techInput || ''}
					placeholder="Flutter, SQLite, Clean Architecture, Provider"
					class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm font-mono text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<!-- Live URL -->
				<div>
					<label for="liveUrl" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Live Demo / Production URL
					</label>
					<input
						type="url"
						id="liveUrl"
						name="liveUrl"
						value={form?.values?.liveUrl || ''}
						placeholder="https://example.com"
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>

				<!-- GitHub URL -->
				<div>
					<label for="githubUrl" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						GitHub Repository URL
					</label>
					<input
						type="url"
						id="githubUrl"
						name="githubUrl"
						value={form?.values?.githubUrl || ''}
						placeholder="https://github.com/rizkiarkant/project"
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<!-- Order Index -->
				<div>
					<label for="orderIndex" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
						Display Order Index
					</label>
					<input
						type="number"
						id="orderIndex"
						name="orderIndex"
						value={form?.values?.orderIndex ?? 10}
						class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm font-mono text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
					/>
				</div>

				<!-- Visibility -->
				<div class="flex items-center pt-6">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							name="isPublished"
							value="true"
							checked
							class="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
						/>
						<span class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
							Publish live to public portfolio immediately
						</span>
					</label>
				</div>
			</div>

			<!-- Project Screenshots / Gallery -->
			<ProjectImageUploader bind:images />

			<!-- Description / Markdown Case Study -->
			<div>
				<label for="description" class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
					Case Study Narrative (Markdown Supported) *
				</label>
				<textarea
					id="description"
					name="description"
					rows="10"
					required
					placeholder="Describe problem statement, technical architecture, engineering challenges, and results..."
					class="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white py-2.5 px-3 font-mono text-xs text-neutral-900 shadow-2xs focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
				>{form?.values?.description || ''}</textarea>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center justify-end gap-3 border-t border-neutral-100 pt-5 dark:border-neutral-800/80">
				<a
					href={resolve('/admin')}
					class="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
				>
					Cancel
				</a>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
				>
					{#if isSubmitting}
						<Icon icon="solar:refresh-bold-duotone" class="size-4 animate-spin" />
						<span>Creating...</span>
					{:else}
						<Icon icon="solar:check-circle-bold-duotone" class="size-4" />
						<span>Create Project</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
