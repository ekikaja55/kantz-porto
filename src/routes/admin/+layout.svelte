<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
	let isMobileDrawerOpen = $state(false);

	type AdminRoute = '/admin' | '/admin/projects' | '/admin/skills' | '/admin/experience';

	const navItems: { href: AdminRoute; label: string; icon: string; exact: boolean }[] = [
		{ href: '/admin', label: 'Overview', icon: 'solar:widget-bold-duotone', exact: true },
		{ href: '/admin/projects', label: 'Projects', icon: 'solar:folder-with-files-bold-duotone', exact: false },
		{ href: '/admin/skills', label: 'Capabilities', icon: 'solar:code-square-bold-duotone', exact: false },
		{ href: '/admin/experience', label: 'Experience', icon: 'solar:case-round-bold-duotone', exact: false }
	];

	function isItemActive(itemHref: string, exact: boolean) {
		const current = page.url.pathname;
		if (exact) {
			return current === itemHref;
		}
		return current.startsWith(itemHref);
	}
</script>

<div class="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 font-sans">
	<!-- Mobile Top Bar with Hamburger -->
	<div class="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200/90 bg-white/90 px-4 backdrop-blur-md md:hidden dark:border-neutral-800/90 dark:bg-neutral-900/90">
		<button
			type="button"
			onclick={() => (isMobileDrawerOpen = true)}
			aria-label="Open sidebar drawer"
			class="rounded-lg p-1.5 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
		>
			<Icon icon="solar:hamburger-menu-bold-duotone" class="size-5" />
		</button>

		<a href={resolve('/admin')} class="flex items-center gap-2 font-display text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
			<span class="flex size-6 items-center justify-center rounded-md bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
				K
			</span>
			<span>CMS Portal</span>
		</a>

		<a
			href={resolve('/(public)')}
			class="rounded-lg p-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
			aria-label="View live website"
		>
			<Icon icon="solar:link-bold-duotone" class="size-4" />
		</a>
	</div>

	<!-- Mobile Drawer Backdrop & Sidebar -->
	{#if isMobileDrawerOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden"
			onclick={() => (isMobileDrawerOpen = false)}
		>
			<div
				class="flex h-full w-64 flex-col bg-white p-4 shadow-2xl dark:bg-neutral-900"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
					<div class="flex items-center gap-2">
						<span class="flex size-7 items-center justify-center rounded-md bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
							K
						</span>
						<span class="font-display font-bold text-neutral-900 dark:text-white">CMS Portal</span>
					</div>
					<button
						type="button"
						onclick={() => (isMobileDrawerOpen = false)}
						class="rounded p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
					>
						<Icon icon="solar:close-circle-bold-duotone" class="size-5" />
					</button>
				</div>

				<nav class="mt-4 flex flex-1 flex-col gap-1">
					{#each navItems as item (item.href)}
						{@const active = isItemActive(item.href, item.exact)}
						<a
							href={resolve(item.href)}
							onclick={() => (isMobileDrawerOpen = false)}
							class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
								{active
								? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
								: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'}"
						>
							<Icon icon={item.icon} class="size-4.5" />
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>

				<div class="border-t border-neutral-200 pt-4 dark:border-neutral-800">
					<div class="mb-3 flex items-center gap-2 px-2 text-xs text-neutral-500">
						<span class="size-2 rounded-full bg-emerald-500"></span>
						<span class="truncate">{data.user.email}</span>
					</div>
					<form method="POST" action="/admin?/logout">
						<button
							type="submit"
							class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
						>
							<Icon icon="solar:logout-2-bold-duotone" class="size-3.5" />
							<span>Sign Out</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<!-- Desktop 240px Fixed Left Sidebar -->
	<aside class="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-60 md:flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
		<!-- Brand Header -->
		<div class="flex h-16 items-center gap-3 border-b border-neutral-200 px-6 dark:border-neutral-800">
			<span class="flex size-8 items-center justify-center rounded-lg bg-neutral-900 font-mono text-sm font-bold text-white dark:bg-white dark:text-neutral-900">
				K
			</span>
			<div class="flex flex-col">
				<span class="font-display text-sm font-bold tracking-tight text-neutral-900 dark:text-white">Kantz CMS</span>
				<span class="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Admin v2.0</span>
			</div>
		</div>

		<!-- Nav Links -->
		<nav class="flex flex-1 flex-col gap-1.5 p-4">
			{#each navItems as item (item.href)}
				{@const active = isItemActive(item.href, item.exact)}
				<a
					href={resolve(item.href)}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors
						{active
						? 'bg-neutral-900 text-white shadow-xs dark:bg-white dark:text-neutral-900'
						: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'}"
				>
					<Icon icon={item.icon} class="size-4" />
					<span>{item.label}</span>
				</a>
			{/each}

			<div class="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
				<a
					href={resolve('/(public)')}
					target="_blank"
					rel="external noopener noreferrer"
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
				>
					<Icon icon="solar:link-bold-duotone" class="size-4" />
					<span>Live Website</span>
				</a>
			</div>
		</nav>

		<!-- Footer User Info & Logout -->
		<div class="border-t border-neutral-200 p-4 dark:border-neutral-800">
			<div class="mb-3 flex items-center gap-2 px-1">
				<span class="size-2 rounded-full bg-emerald-500 shrink-0"></span>
				<span class="font-mono text-xs text-neutral-600 truncate dark:text-neutral-400">
					{data.user.email}
				</span>
			</div>
			<form method="POST" action="/admin?/logout">
				<button
					type="submit"
					class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200/80 bg-red-50/60 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
				>
					<Icon icon="solar:logout-2-bold-duotone" class="size-3.5" />
					<span>Sign Out</span>
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Body Content (Shifted on Desktop) -->
	<div class="md:pl-60">
		<main class="mx-auto max-w-6xl p-4 sm:p-8">
			{@render children()}
		</main>
	</div>
</div>
