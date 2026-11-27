<script lang="ts">
	import './terminal.css';
	import { onMount, tick, type Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto, afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Scrollback from './Scrollback.svelte';
	import TabStrip from './TabStrip.svelte';
	import Drawer from './Drawer.svelte';
	import InputBar from './InputBar.svelte';
	import StatusBar from './StatusBar.svelte';
	import { COMMAND_REGISTRY, parse, resolveParentRoute } from '#lib/terminal/commands';
	import { initHistory, recordCommand, getHistory } from '#lib/terminal/history.svelte';
	import { appendScrollback, clearScrollback } from '#lib/terminal/scrollback.svelte';
	import {
		initTheme,
		setTheme,
		toggleTheme,
		isThemeName
	} from '#lib/terminal/theme.svelte';
	import { setStatusMessage } from '#lib/terminal/status.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let mainEl = $state<HTMLElement | null>(null);
	let bgStageEl = $state<HTMLDivElement | null>(null);
	let cursorGlowEl = $state<HTMLDivElement | null>(null);
	let cursorDotsEl = $state<HTMLDivElement | null>(null);
	let cursorDotsSheetEl = $state<HTMLDivElement | null>(null);
	let inputBarRef = $state<InputBar | null>(null);
	let statusBarRef = $state<StatusBar | null>(null);
	let chromeHeight = $state<number | null>(null);
	let promptBelow = $state(false);
	let drawerOpen = $state(false);

	const slugList = $derived(
		((page.data?.projectSlugs as { slug: string; title: string }[] | undefined) ?? []).map(
			(item) => item.slug
		)
	);

	function isDesktopPointer(): boolean {
		return (
			typeof window !== 'undefined' &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(hover: hover) and (pointer: fine)').matches
		);
	}

	onMount(() => {
		initTheme();
		initHistory();

		if (
			!isDesktopPointer() ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return;
		}

		let rafId = 0;
		let pointerX = 0;
		let pointerY = 0;

		function flushPointer() {
			rafId = 0;
			if (!bgStageEl) return;
			const gx = Math.round(pointerX - 280);
			const gy = Math.round(pointerY - 280);
			if (cursorGlowEl) {
				cursorGlowEl.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
			}
			const dx = Math.round(pointerX - 240);
			const dy = Math.round(pointerY - 240);
			if (cursorDotsEl) {
				cursorDotsEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
			}
			if (cursorDotsSheetEl) {
				const ox = ((dx % 24) + 24) % 24;
				const oy = ((dy % 24) + 24) % 24;
				cursorDotsSheetEl.style.transform = `translate3d(${-ox}px, ${-oy}px, 0)`;
			}
			bgStageEl.classList.add('term-pointer-active');
		}

		function handlePointerMove(e: PointerEvent) {
			if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
			pointerX = e.clientX;
			pointerY = e.clientY;
			if (!rafId) {
				rafId = window.requestAnimationFrame(flushPointer);
			}
		}

		function handlePointerLeave() {
			bgStageEl?.classList.remove('term-pointer-active');
		}

		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		document.documentElement.addEventListener('pointerleave', handlePointerLeave, {
			passive: true
		});
		window.addEventListener('blur', handlePointerLeave, { passive: true });

		return () => {
			if (rafId) {
				window.cancelAnimationFrame(rafId);
			}
			window.removeEventListener('pointermove', handlePointerMove);
			document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
			window.removeEventListener('blur', handlePointerLeave);
		};
	});

	afterNavigate((navigation) => {
		clearScrollback();
		drawerOpen = false;
		promptBelow = false;

		if (navigation.from) {
			tick().then(() => {
				if (typeof document !== 'undefined' && document.title) {
					setStatusMessage(document.title);
				}
				if (isDesktopPointer()) {
					inputBarRef?.focusInput({ scroll: false });
				}
			});
		}
	});

	function keepPromptVisible() {
		tick().then(() => {
			inputBarRef?.scrollPromptIntoView();
		});
	}

	function navigateCommandRoute(route: string | undefined, slugArg?: string) {
		if (slugArg) {
			goto(resolve('/(public)/projects/[slug]', { slug: slugArg }));
			return;
		}
		if (route === '/projects') {
			goto(resolve('/(public)/projects'));
		} else if (route === '/skills') {
			goto(resolve('/(public)/skills'));
		} else if (route === '/experience') {
			goto(resolve('/(public)/experience'));
		} else if (route === '/contact') {
			goto(resolve('/(public)/contact'));
		} else if (route === '/login') {
			goto(resolve('/login'));
		} else {
			goto(resolve('/(public)'));
		}
	}

	function executeInlineAction(
		action: 'help' | 'theme' | 'history' | 'clear',
		echo: string,
		arg?: string
	) {
		if (action === 'clear') {
			clearScrollback();
			return;
		}

		if (action === 'help') {
			appendScrollback(echo, { type: 'help' });
			keepPromptVisible();
			return;
		}

		if (action === 'history') {
			appendScrollback(echo, { type: 'history', entries: [...getHistory()] });
			keepPromptVisible();
			return;
		}

		if (action === 'theme') {
			const next = arg && isThemeName(arg) ? setTheme(arg) : toggleTheme();
			appendScrollback(echo, { type: 'theme', theme: next });
			keepPromptVisible();
		}
	}

	function executeCommand(raw: string, recordToHistory: boolean) {
		const trimmed = raw.trim();
		if (!trimmed) return;

		if (recordToHistory) {
			recordCommand(trimmed);
		}
		const result = parse(trimmed, COMMAND_REGISTRY, slugList);

		if (result.kind === 'empty') return;

		if (result.kind === 'unknown') {
			appendScrollback(trimmed, {
				type: 'unknown',
				input: result.input,
				suggestions: result.suggestions
			});
			keepPromptVisible();
			return;
		}

		if (result.kind === 'bad-args') {
			appendScrollback(trimmed, {
				type: 'bad-args',
				usage: result.usage
			});
			keepPromptVisible();
			return;
		}

		const { command, arg } = result;
		if (command.kind === 'nav') {
			drawerOpen = false;
			if (command.id === 'back') {
				const depth = arg === 'root' ? 'root' : 'parent';
				const target = resolveParentRoute(page.url.pathname, depth);
				if (!target) {
					appendScrollback(trimmed, {
						type: 'info',
						text: 'already at ~ (landing page)'
					});
					keepPromptVisible();
				} else {
					navigateCommandRoute(target);
				}
				return;
			}
			if (command.id === 'open' && arg) {
				navigateCommandRoute(undefined, arg);
			} else {
				navigateCommandRoute(command.route);
			}
			return;
		}

		if (command.kind === 'inline' && command.inline) {
			executeInlineAction(command.inline, trimmed, arg);
		}
	}

	function handleCommandSubmit(raw: string) {
		executeCommand(raw, true);
	}

	function handleExampleCommand(raw: string) {
		executeCommand(raw, false);
	}

	function handleInlineMenu(action: 'help' | 'history' | 'theme' | 'clear') {
		executeInlineAction(action, action);
	}

	function handleCandidates(echo: string, items: readonly string[]) {
		appendScrollback(echo, { type: 'candidates', items });
		keepPromptVisible();
	}

	function handleToggleDrawer() {
		if (!drawerOpen) {
			inputBarRef?.blurInput();
		}
		drawerOpen = !drawerOpen;
	}

	function handleJumpToPrompt() {
		drawerOpen = false;
		inputBarRef?.focusInput({ scroll: true });
	}

	function handleWindowKeyDown(e: KeyboardEvent) {
		// Ctrl+L anywhere runs clear
		if (e.ctrlKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === 'l') {
			e.preventDefault();
			clearScrollback();
			drawerOpen = false;
			return;
		}

		// Esc closes mobile drawer and returns focus to [menu] button
		if (e.key === 'Escape' && drawerOpen) {
			e.preventDefault();
			drawerOpen = false;
			statusBarRef?.focusMenuButton();
			return;
		}

		// Desktop type-to-focus (all 4 conditions from design.md 6.4 + never hijack interactive controls)
		if (!isDesktopPointer()) return;
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key.length !== 1 || e.key === ' ') return;

		const active = document.activeElement;
		const inBodyOrMain =
			active === document.body || (mainEl !== null && active !== null && mainEl.contains(active));
		if (!inBodyOrMain) return;

		if (
			active instanceof Element &&
			active.closest('a, button, input, textarea, select, summary, [contenteditable="true"]')
		) {
			return;
		}

		if (document.querySelector('dialog[open]') !== null) {
			return;
		}

		e.preventDefault();
		inputBarRef?.appendAndFocus(e.key);
	}
</script>

<svelte:window onkeydown={handleWindowKeyDown} />

<div
	data-ui="terminal"
	class="term-canvas min-h-dvh flex flex-col bg-term-bg text-term-fg font-term-mono text-[15px] md:text-[17px] leading-[1.55]"
>
	<!-- GPU-composited interactive atmospheric canvas -->
	<div bind:this={bgStageEl} class="term-bg-stage" aria-hidden="true">
		<div class="term-bg-grid"></div>
		<div class="term-bg-aurora"></div>
		<div class="term-bg-sweep"></div>
		<div bind:this={cursorGlowEl} class="term-bg-cursor-glow"></div>
		<div bind:this={cursorDotsEl} class="term-bg-cursor-dots">
			<div bind:this={cursorDotsSheetEl} class="term-bg-cursor-dots-sheet"></div>
		</div>
	</div>

	<!-- Skip links -->
	<a
		href="#main"
		class="term-skip-link sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-term-accent focus:text-term-bg focus:font-bold"
	>
		Skip to content
	</a>
	<a
		href="#command"
		class="term-skip-link sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-48 focus:z-50 focus:px-3 focus:py-2 focus:bg-term-accent focus:text-term-bg focus:font-bold"
	>
		Skip to command input
	</a>

	<!-- Full-width flush-left terminal canvas with inline flowing prompt -->
	<main
		bind:this={mainEl}
		id="main"
		tabindex="-1"
		class="flex-1 w-full px-4 sm:px-8 lg:px-10 py-5 sm:py-6 focus:outline-none"
	>
		<Scrollback
			sampleSlug={slugList[0] ?? 'invoizy'}
			onrunexample={handleExampleCommand}
		>
			{@render children()}
		</Scrollback>

		<InputBar
			bind:this={inputBarRef}
			slugs={slugList}
			dockHeight={chromeHeight}
			onbelowchange={(below) => (promptBelow = below)}
			onsubmitcommand={handleCommandSubmit}
			oncandidates={handleCandidates}
		/>
	</main>

	<!-- Full-bleed sticky bottom tmux chrome (navigation below inline prompt) -->
	<div class="term-dock sticky bottom-0 z-30 w-full bg-term-surface">
		{#if promptBelow && !drawerOpen}
			<button
				type="button"
				data-testid="pager-hint"
				onclick={handleJumpToPrompt}
				class="group w-full min-h-[44px] md:min-h-0 bg-term-bg border-t border-term-border px-4 sm:px-8 lg:px-10 py-1.5 flex items-center justify-between gap-3 font-term-mono text-[14px] md:text-[15px] leading-[1.4] select-none cursor-pointer text-left"
			>
				<span class="text-term-muted group-hover:text-term-fg truncate">
					<span class="hidden md:inline">-- prompt below: start typing or jump down --</span>
					<span class="md:hidden">-- prompt below --</span>
				</span>
				<span
					class="shrink-0 px-2 py-0.5 text-term-accent group-hover:bg-term-accent group-hover:text-term-bg"
				>
					[ jump to $ ]
				</span>
			</button>
		{/if}
		<Drawer
			open={drawerOpen}
			onclose={() => (drawerOpen = false)}
			oninline={handleInlineMenu}
		/>
		<div
			bind:offsetHeight={chromeHeight}
			class="border-t border-term-border pb-[env(safe-area-inset-bottom)]"
		>
			<TabStrip oninline={handleInlineMenu} />
			<StatusBar
				bind:this={statusBarRef}
				{drawerOpen}
				hideJumpButton={promptBelow && !drawerOpen}
				ontoggledrawer={handleToggleDrawer}
				onjumptoprompt={handleJumpToPrompt}
			/>
		</div>
	</div>
</div>
