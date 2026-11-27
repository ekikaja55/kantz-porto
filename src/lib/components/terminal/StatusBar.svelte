<script lang="ts">
	import { onMount } from 'svelte';
	import { navigating, page } from '$app/state';
	import { getStatusMessage } from '#lib/terminal/status.svelte';
	import { getTheme, toggleTheme } from '#lib/terminal/theme.svelte';

	interface Props {
		drawerOpen?: boolean;
		hideJumpButton?: boolean;
		ontoggledrawer?: () => void;
		onjumptoprompt?: () => void;
		class?: string;
	}

	let {
		drawerOpen = false,
		hideJumpButton = false,
		ontoggledrawer,
		onjumptoprompt,
		class: className = ''
	}: Props = $props();

	let menuButtonEl = $state<HTMLButtonElement | null>(null);
	let clock = $state('');

	export function focusMenuButton() {
		menuButtonEl?.focus();
	}

	onMount(() => {
		function updateClock() {
			const now = new Date();
			const h = String(now.getHours()).padStart(2, '0');
			const m = String(now.getMinutes()).padStart(2, '0');
			clock = `${h}:${m}`;
		}

		updateClock();
		const interval = setInterval(updateClock, 10000);
		return () => clearInterval(interval);
	});

	const promptPath = $derived.by(() => {
		const pathname = page.url.pathname;
		if (pathname === '/' || pathname === '') return '~';
		if (pathname === '/projects') return '~/projects';
		if (pathname.startsWith('/projects/')) {
			return `~/projects/${pathname.replace('/projects/', '')}`;
		}
		if (pathname.startsWith('/skills')) return '~/skills';
		if (pathname.startsWith('/experience')) return '~/experience';
		if (pathname.startsWith('/contact')) return '~/contact';
		return '~';
	});

	const activeMessage = $derived(getStatusMessage());
	const currentTheme = $derived(getTheme());
	const isLoading = $derived(navigating.to !== null);

	function handleThemeClick(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement | null;
		if (e.clientX === 0 && e.clientY === 0 && target) {
			const rect = target.getBoundingClientRect();
			toggleTheme(true, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
			return;
		}
		toggleTheme(true, { x: e.clientX, y: e.clientY });
	}
</script>

<footer
	class="w-full bg-term-surface text-[15px] md:text-[17px] leading-[1.5] font-term-mono select-none overflow-hidden shrink-0 {className}"
	aria-label="Statusline"
>
	<div class="w-full flex items-stretch">
		<!-- Mobile drawer toggle (sticky so always reachable on long pages) -->
		<button
			bind:this={menuButtonEl}
			type="button"
			onclick={() => ontoggledrawer?.()}
			aria-expanded={drawerOpen}
			aria-controls="term-mobile-drawer"
			aria-label="Toggle command menu"
			class="md:hidden shrink-0 min-h-[44px] px-3 py-1.5 border-r border-term-border bg-term-surface text-term-fg hover:bg-term-accent hover:text-term-bg flex items-center cursor-pointer"
		>
			[menu]
		</button>

		<!-- Session Anchor Badge (Inverse Video) -->
		<div
			class="hidden sm:flex bg-term-accent text-term-bg font-bold px-3 sm:px-5 py-1.5 items-center shrink-0"
		>
			kantz
		</div>

		<!-- Quick jump to inline command prompt (hidden while pager bar is shown above) -->
		{#if !hideJumpButton}
			<button
				type="button"
				onclick={() => onjumptoprompt?.()}
				aria-label="Jump to command prompt"
				title="Jump to command prompt"
				class="shrink-0 min-h-[44px] md:min-h-0 px-3 py-1.5 border-r border-term-border text-term-accent hover:bg-term-accent hover:text-term-bg transition-colors duration-150 flex items-center cursor-pointer"
			>
				[$]
			</button>
		{/if}

		<!-- Route Path (Hidden below 768px) -->
		<div
			class="hidden md:flex items-center px-4 py-1.5 text-term-info border-r border-term-border shrink-0"
		>
			{promptPath}
		</div>

		<!-- Loading indicator -->
		{#if isLoading}
			<div
				class="flex items-center px-3 sm:px-4 py-1.5 text-term-warn border-r border-term-border shrink-0"
			>
				loading
			</div>
		{/if}

		<!-- Transient message (flex, truncates, polite live region) -->
		<div
			role="status"
			class="flex-1 min-w-0 px-3 sm:px-4 py-1.5 text-term-muted truncate flex items-center"
		>
			{#if activeMessage}
				<span class="truncate text-term-fg">{activeMessage}</span>
			{/if}
		</div>

		<!-- Theme segment button -->
		<button
			type="button"
			onclick={handleThemeClick}
			aria-label="Switch theme (current: {currentTheme})"
			class="flex items-center gap-2 min-h-[44px] md:min-h-0 px-3 sm:px-5 py-1.5 text-term-special border-l border-term-border hover:bg-term-special hover:text-term-bg transition-colors duration-150 shrink-0 cursor-pointer"
		>
			<span class="inline-block w-2 h-2 bg-current shrink-0" aria-hidden="true"></span>
			<span>{currentTheme}</span>
		</button>

		<!-- Clock (Hidden below 768px, mount-only) -->
		{#if clock}
			<div
				class="hidden md:flex items-center px-4 sm:px-5 py-1.5 text-term-muted border-l border-term-border tabular-nums shrink-0"
			>
				{clock}
			</div>
		{/if}
	</div>
</footer>
