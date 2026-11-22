<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Icon from '@iconify/svelte';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Admin Login - Kantz Portfolio</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<!-- Back to Portfolio Link -->
		<a
			href={resolve('/(public)')}
			class="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
		>
			<Icon icon="solar:arrow-left-bold-duotone" class="size-4" />
			<span>Back to Portfolio</span>
		</a>

		<div class="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800/90 dark:bg-neutral-900/80">
			<!-- Header -->
			<div class="text-center">
				<div class="mx-auto flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white">
					<Icon icon="solar:shield-keyhole-bold-duotone" class="size-6 text-neutral-800 dark:text-neutral-200" />
				</div>
				<h1 class="mt-4 font-display text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
					Admin Portal
				</h1>
				<p class="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
					Enter administrative credentials to manage portfolio content.
				</p>
			</div>

			<!-- Error Feedback Banner -->
			{#if form?.error}
				<div
					role="alert"
					class="mt-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
				>
					<Icon icon="solar:danger-triangle-bold-duotone" class="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
					<span class="leading-relaxed">{form.error}</span>
				</div>
			{/if}

			<!-- Login Form -->
			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="mt-6 space-y-4"
			>
				<div>
					<label
						for="email"
						class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
					>
						Admin Email
					</label>
					<div class="relative mt-1.5">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
							<Icon icon="solar:letter-bold-duotone" class="size-4" />
						</div>
						<input
							type="email"
							id="email"
							name="email"
							required
							autocomplete="username"
							value={form?.email || ''}
							placeholder="admin@example.com"
							class="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-2xs transition-colors focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-500"
						/>
					</div>
				</div>

				<div>
					<label
						for="password"
						class="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300"
					>
						Password
					</label>
					<div class="relative mt-1.5">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
							<Icon icon="solar:lock-password-bold-duotone" class="size-4" />
						</div>
						<input
							type="password"
							id="password"
							name="password"
							required
							autocomplete="current-password"
							placeholder="••••••••"
							class="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-2xs transition-colors focus:border-neutral-500 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-500"
						/>
					</div>
				</div>

				<div class="pt-2">
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
					>
						{#if isSubmitting}
							<Icon icon="solar:refresh-bold-duotone" class="size-4 animate-spin" />
							<span>Authenticating...</span>
						{:else}
							<Icon icon="solar:login-2-bold-duotone" class="size-4" />
							<span>Sign In to Dashboard</span>
						{/if}
					</button>
				</div>
			</form>

			<div class="mt-6 border-t border-neutral-100 pt-4 text-center dark:border-neutral-800/80">
				<p class="text-[11px] text-neutral-400">
					Protected with Upstash Redis rate limiting & Better Auth session encryption.
				</p>
			</div>
		</div>
	</div>
</main>
