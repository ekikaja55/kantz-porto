<script lang="ts">
	import TermIcon from './TermIcon.svelte';
	import Kbd from './Kbd.svelte';

	interface Props {
		images: string[];
		title: string;
	}

	let { images, title }: Props = $props();

	let dialogEl: HTMLDialogElement | undefined = $state();
	let triggerEl: HTMLElement | null = $state(null);
	let currentIndex = $state(0);

	function open(idx: number, e?: MouseEvent) {
		triggerEl = (e?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement);
		currentIndex = idx;
		dialogEl?.showModal();
	}

	function close() {
		dialogEl?.close();
	}

	function next() {
		if (images.length === 0) return;
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		if (images.length === 0) return;
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		}
	}
</script>

{#if images.length > 0}
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
		{#each images as img, idx (idx)}
			<button
				type="button"
				onclick={(e) => open(idx, e)}
				class="border border-term-border p-1.5 hover:border-term-accent cursor-pointer bg-term-surface text-left"
				aria-label="View screenshot {idx + 1} of {images.length}"
			>
				<img
					src={img}
					alt="{title} screenshot {idx + 1}"
					loading="lazy"
					width="640"
					height="360"
					class="w-full h-52 object-cover border border-term-border"
				/>
				<div class="mt-1.5 text-[14px] md:text-[15px] leading-[1.5] font-term-mono text-term-muted">
					[{idx + 1}/{images.length}]
				</div>
			</button>
		{/each}
	</div>

	<dialog
		bind:this={dialogEl}
		onkeydown={handleKeydown}
		onclose={() => triggerEl?.focus()}
		aria-label="{title} image viewer"
		class="backdrop:bg-black/70 bg-term-bg border border-term-border text-term-fg p-5 max-w-5xl w-[95vw] m-auto"
	>
		<div
			class="flex items-center justify-between border-b border-term-border pb-2.5 mb-4 font-term-mono text-[15px] md:text-[17px] leading-[1.5]"
		>
			<div class="font-bold truncate pr-2">
				{title} [{currentIndex + 1}/{images.length}]
			</div>
			<button
				type="button"
				onclick={close}
				class="min-h-[40px] px-2.5 hover:bg-term-accent hover:text-term-bg cursor-pointer flex items-center gap-1"
				aria-label="Close image viewer"
			>
				<span>[esc</span>
				<TermIcon name="close" size={16} />
				<span>]</span>
			</button>
		</div>

		<div class="flex items-center justify-center p-2 bg-term-surface border border-term-border">
			<img
				src={images[currentIndex]}
				alt="{title} screenshot {currentIndex + 1}"
				class="max-h-[68vh] w-auto max-w-full object-contain"
			/>
		</div>

		<div
			class="flex items-center justify-between mt-4 font-term-mono text-[15px] md:text-[16px] leading-[1.5] text-term-muted"
		>
			<button
				type="button"
				onclick={prev}
				class="min-h-[44px] px-3.5 py-1.5 border border-term-border text-term-fg hover:bg-term-accent hover:text-term-bg cursor-pointer"
			>
				[&lt; prev]
			</button>
			<div class="hidden sm:flex items-center gap-2 text-[14px] md:text-[15px]">
				<span>navigate:</span>
				<Kbd key="Left" />
				<Kbd key="Right" />
				<span>close:</span>
				<Kbd key="Esc" />
			</div>
			<button
				type="button"
				onclick={next}
				class="min-h-[44px] px-3.5 py-1.5 border border-term-border text-term-fg hover:bg-term-accent hover:text-term-bg cursor-pointer"
			>
				[next &gt;]
			</button>
		</div>
	</dialog>
{/if}
