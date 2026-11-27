<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { COMMAND_REGISTRY } from '#lib/terminal/commands';

	interface Props {
		oninline: (action: 'help' | 'history' | 'theme' | 'clear') => void;
	}

	let { oninline }: Props = $props();

	let isOpen = $state(true);

	const navCommands = COMMAND_REGISTRY.filter((cmd) => cmd.menu && cmd.kind === 'nav');
	const inlineCommands = COMMAND_REGISTRY.filter((cmd) => cmd.menu && cmd.kind === 'inline');

	onMount(() => {
		const navAttr = document.documentElement.getAttribute('data-nav');
		if (navAttr === 'closed') {
			isOpen = false;
			return;
		}
		try {
			if (window.localStorage.getItem('kantz-nav') === 'closed') {
				isOpen = false;
				document.documentElement.setAttribute('data-nav', 'closed');
			}
		} catch {
			// Ignore storage errors in private browsing modes
		}
	});

	function toggleStrip() {
		const next = !isOpen;
		isOpen = next;
		if (next) {
			document.documentElement.removeAttribute('data-nav');
		} else {
			document.documentElement.setAttribute('data-nav', 'closed');
		}
		try {
			window.localStorage.setItem('kantz-nav', next ? 'open' : 'closed');
		} catch {
			// Ignore storage errors
		}
	}

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

<nav
	aria-label="Commands"
	class="hidden md:block w-full bg-term-surface border-b border-term-border text-[15px] md:text-[17px] leading-[1.5] font-term-mono select-none"
>
	<div class="w-full px-4 sm:px-8 lg:px-10 py-2 flex items-center gap-3">
		<button
			type="button"
			onclick={toggleStrip}
			aria-label={isOpen ? 'Collapse navigation' : 'Expand navigation'}
			aria-expanded={isOpen}
			aria-controls="term-strip-items"
			class="shrink-0 px-2 py-0.5 text-term-muted hover:text-term-fg cursor-pointer"
		>
			{isOpen ? '[-]' : '[+]'}
		</button>

		<div
			id="term-strip-items"
			class="term-strip-items {isOpen
				? 'flex'
				: 'hidden'} flex-1 min-w-0 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			<div class="flex items-center gap-1.5">
				{#each navCommands as cmd (cmd.id)}
					{#if cmd.route}
						{@const active = isRouteActive(cmd.route, page.url.pathname)}
						<a
							href={resolve(toPublicRouteId(cmd.route))}
							aria-current={page.url.pathname === cmd.route ? 'page' : undefined}
							class="shrink-0 px-2.5 py-0.5 transition-colors duration-150 {active
								? 'bg-term-accent text-term-bg font-bold'
								: 'text-term-fg hover:text-term-accent hover:bg-term-accent/10'}"
						>
							{cmd.name}
						</a>
					{/if}
				{/each}
			</div>

			<div class="ml-auto flex items-center gap-1.5 pl-4 border-l border-term-border shrink-0">
				{#each inlineCommands as cmd (cmd.id)}
					{#if cmd.inline === 'help' || cmd.inline === 'history' || cmd.inline === 'theme' || cmd.inline === 'clear'}
						{@const action = cmd.inline}
						<button
							type="button"
							onclick={() => oninline(action)}
							class="shrink-0 px-2.5 py-0.5 text-term-muted hover:text-term-info hover:bg-term-info/10 transition-colors duration-150 cursor-pointer"
						>
							{cmd.name}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</nav>
