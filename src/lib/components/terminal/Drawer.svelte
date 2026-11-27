<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { COMMAND_REGISTRY } from '#lib/terminal/commands';

	interface Props {
		open: boolean;
		onclose: () => void;
		oninline: (action: 'help' | 'history' | 'theme' | 'clear') => void;
	}

	let { open, onclose, oninline }: Props = $props();

	const menuCommands = COMMAND_REGISTRY.filter((cmd) => cmd.menu);

	type PublicRouteId =
		| '/(public)'
		| '/(public)/projects'
		| '/(public)/skills'
		| '/(public)/experience'
		| '/(public)/contact';

	function toPublicRouteId(route: string): PublicRouteId {
		if (route === '/projects') return '/(public)/projects';
		if (route === '/skills') return '/(public)/skills';
		if (route === '/experience') return '/(public)/experience';
		if (route === '/contact') return '/(public)/contact';
		return '/(public)';
	}

	function isRouteActive(route: string | undefined, pathname: string): boolean {
		if (!route) return false;
		if (route === '/') return pathname === '/';
		return pathname === route || pathname.startsWith(`${route}/`);
	}
</script>

{#if open}
	<nav
		id="term-mobile-drawer"
		aria-label="Commands"
		class="md:hidden w-full max-h-[50dvh] overflow-y-auto border-t border-term-border bg-term-surface text-[15px] leading-[1.5] font-term-mono"
	>
		<div class="w-full divide-y divide-term-border">
			{#each menuCommands as cmd (cmd.id)}
				{#if cmd.kind === 'nav' && cmd.route}
					{@const active = isRouteActive(cmd.route, page.url.pathname)}
					<a
						href={resolve(toPublicRouteId(cmd.route))}
						onclick={onclose}
						aria-current={page.url.pathname === cmd.route ? 'page' : undefined}
						class="min-h-[48px] px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 {active
							? 'bg-term-accent text-term-bg font-bold'
							: 'text-term-fg'}"
					>
						<span class="shrink-0">{cmd.name}</span>
						<span
							class="truncate text-right {active ? 'text-term-bg font-normal' : 'text-term-muted'}"
						>
							{cmd.description}
						</span>
					</a>
				{:else if cmd.kind === 'inline' && (cmd.inline === 'help' || cmd.inline === 'history' || cmd.inline === 'theme' || cmd.inline === 'clear')}
					{@const action = cmd.inline}
					<button
						type="button"
						onclick={() => {
							oninline(action);
							onclose();
						}}
						class="w-full min-h-[48px] px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 text-left text-term-fg cursor-pointer"
					>
						<span class="shrink-0">{cmd.name}</span>
						<span class="truncate text-right text-term-muted">{cmd.description}</span>
					</button>
				{/if}
			{/each}
		</div>
	</nav>
{/if}
