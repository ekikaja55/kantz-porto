<script lang="ts">
	import { onMount } from 'svelte';
	import Prompt from './Prompt.svelte';
	import { COMMAND_REGISTRY, completeInput, getGhostSuggestion } from '#lib/terminal/commands';
	import { getHistory } from '#lib/terminal/history.svelte';

	interface Props {
		slugs?: readonly string[];
		dockHeight?: number | null;
		onbelowchange?: (belowViewport: boolean) => void;
		onsubmitcommand?: (raw: string) => void;
		oncandidates?: (echo: string, items: readonly string[]) => void;
		class?: string;
	}

	let {
		slugs = [],
		dockHeight = null,
		onbelowchange,
		onsubmitcommand,
		oncandidates,
		class: className = ''
	}: Props = $props();

	let promptLineEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);
	let value = $state('');
	let isFocused = $state(false);
	let isTyping = $state(false);
	let typingTimer: ReturnType<typeof setTimeout> | undefined;
	let historyCursor = $state(-1);
	let draftBeforeHistory = $state('');
	let lastTabSnapshot = $state<string | null>(null);

	function pulseTyping() {
		isTyping = true;
		if (typingTimer !== undefined) {
			clearTimeout(typingTimer);
		}
		typingTimer = setTimeout(() => {
			isTyping = false;
			typingTimer = undefined;
		}, 450);
	}

	const ghostSuffix = $derived(getGhostSuggestion(value, COMMAND_REGISTRY, slugs));

	function isDesktopPointer(): boolean {
		return (
			typeof window !== 'undefined' &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(hover: hover) and (pointer: fine)').matches
		);
	}

	onMount(() => {
		if (isDesktopPointer()) {
			inputEl?.focus({ preventScroll: true });
		}
		isFocused = document.activeElement === inputEl;
		return () => {
			if (typingTimer !== undefined) {
				clearTimeout(typingTimer);
			}
		};
	});

	$effect(() => {
		const target = promptLineEl;
		const offset = dockHeight ?? 0;
		if (!target || typeof IntersectionObserver === 'undefined') {
			onbelowchange?.(false);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				const hiddenBelow = !entry.isIntersecting && entry.boundingClientRect.top > 0;
				onbelowchange?.(hiddenBelow);
			},
			{
				root: null,
				rootMargin: `0px 0px -${offset}px 0px`,
				threshold: 0.1
			}
		);

		observer.observe(target);
		return () => observer.disconnect();
	});

	export function scrollPromptIntoView() {
		if (promptLineEl && typeof promptLineEl.scrollIntoView === 'function') {
			promptLineEl.scrollIntoView({ block: 'nearest', behavior: 'instant' });
		}
	}

	export function focusInput(options?: { scroll?: boolean }) {
		if (!inputEl) return;
		if (options?.scroll) {
			scrollPromptIntoView();
		}
		inputEl.focus({ preventScroll: true });
	}

	export function blurInput() {
		inputEl?.blur();
	}

	export function appendAndFocus(char: string) {
		value = `${value}${char}`;
		lastTabSnapshot = null;
		historyCursor = -1;
		if (inputEl) {
			scrollPromptIntoView();
			inputEl.focus({ preventScroll: true });
			const end = value.length;
			inputEl.setSelectionRange(end, end);
		}
	}

	function handleInput() {
		pulseTyping();
		scrollPromptIntoView();
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const submitted = value;
		value = '';
		isTyping = false;
		historyCursor = -1;
		draftBeforeHistory = '';
		lastTabSnapshot = null;
		onsubmitcommand?.(submitted);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (
			e.key === 'ArrowRight' &&
			ghostSuffix.length > 0 &&
			inputEl &&
			inputEl.selectionStart === value.length &&
			inputEl.selectionEnd === value.length
		) {
			e.preventDefault();
			value = `${value}${ghostSuffix}`;
			lastTabSnapshot = null;
			scrollPromptIntoView();
			return;
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			const entries = getHistory();
			if (entries.length === 0) return;

			if (historyCursor === -1) {
				draftBeforeHistory = value;
				historyCursor = entries.length - 1;
			} else if (historyCursor > 0) {
				historyCursor -= 1;
			}

			value = entries[historyCursor]?.command ?? '';
			lastTabSnapshot = null;
			scrollPromptIntoView();
			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			const entries = getHistory();
			if (historyCursor === -1) return;

			if (historyCursor < entries.length - 1) {
				historyCursor += 1;
				value = entries[historyCursor]?.command ?? '';
			} else {
				historyCursor = -1;
				value = draftBeforeHistory;
			}

			lastTabSnapshot = null;
			scrollPromptIntoView();
			return;
		}

		if (e.key === 'Tab' && !e.shiftKey) {
			e.preventDefault();
			scrollPromptIntoView();
			const res = completeInput(value, COMMAND_REGISTRY, slugs);

			if (res.kind === 'single') {
				value = res.value;
				lastTabSnapshot = null;
				return;
			}

			if (res.kind === 'multiple') {
				if (res.value !== value) {
					value = res.value;
					lastTabSnapshot = res.value;
				} else if (lastTabSnapshot === value) {
					oncandidates?.(value.trim() || 'tab', res.candidates);
				} else {
					lastTabSnapshot = value;
				}
			}
			return;
		}

		if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta') {
			lastTabSnapshot = null;
		}
	}
</script>

<div
	bind:this={promptLineEl}
	data-testid="inline-prompt"
	class="term-prompt-line {isFocused
		? 'term-prompt-focused'
		: ''} mt-4 py-1 scroll-mb-28 {className}"
>
	<form onsubmit={handleSubmit} class="flex items-center gap-2.5">
		<Prompt />

		<label for="command" class="sr-only">Command</label>
		<div class="relative flex-1 min-w-0 flex items-center">
			{#if value.length === 0}
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre font-term-mono text-[16px] md:text-[18px] leading-[1.5]"
				>
					<span
						data-testid="block-caret"
						class="inline-block w-[0.62em] h-[1.15em] shrink-0 mr-2 {isFocused
							? isTyping
								? 'bg-term-accent term-caret-solid'
								: 'bg-term-accent term-caret-blink'
							: 'border border-term-accent'}"
					></span><span class="text-term-muted truncate">type help</span>
				</div>
			{:else if ghostSuffix}
				<div
					aria-hidden="true"
					data-testid="ghost-suggestion"
					class="pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre font-term-mono text-[16px] md:text-[18px] leading-[1.5]"
				>
					<span class="invisible">{value}</span><span class="text-term-faint">{ghostSuffix}</span>
				</div>
			{/if}
			<input
				bind:this={inputEl}
				bind:value
				oninput={handleInput}
				onkeydown={handleKeyDown}
				onfocus={() => (isFocused = true)}
				onblur={() => (isFocused = false)}
				id="command"
				type="text"
				placeholder="type help"
				autocomplete="off"
				autocapitalize="off"
				autocorrect="off"
				spellcheck="false"
				enterkeyhint="go"
				class="term-input relative z-10 w-full min-w-0 bg-transparent border-0 p-0 text-[16px] md:text-[18px] leading-[1.5] text-term-fg placeholder:text-transparent font-term-mono focus:ring-0 focus:outline-none {value.length ===
				0
					? 'caret-transparent'
					: ''}"
			/>
		</div>
	</form>
</div>
