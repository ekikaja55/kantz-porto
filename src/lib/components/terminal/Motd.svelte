<script lang="ts">
	import { onMount } from 'svelte';

	const SPINNER_FRAMES = ['|', '/', '-', '\\'] as const;

	let booted = $state(false);
	let spinIndex = $state(0);

	onMount(() => {
		const root = document.documentElement;
		if (root.hasAttribute('data-booted')) {
			booted = true;
			return;
		}

		let timer: ReturnType<typeof setTimeout> | undefined;
		let spinTimer: ReturnType<typeof setInterval> | undefined;

		function finishBoot() {
			root.setAttribute('data-booted', '1');
			booted = true;
			try {
				window.sessionStorage.setItem('kantz-booted', '1');
			} catch {
				// Ignore private browsing storage errors
			}
			if (timer !== undefined) {
				clearTimeout(timer);
				timer = undefined;
			}
			if (spinTimer !== undefined) {
				clearInterval(spinTimer);
				spinTimer = undefined;
			}
			window.removeEventListener('pointerdown', finishBoot);
			window.removeEventListener('keydown', finishBoot);
		}

		if (
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			finishBoot();
			return;
		}

		spinTimer = setInterval(() => {
			spinIndex = (spinIndex + 1) % SPINNER_FRAMES.length;
		}, 100);
		timer = setTimeout(finishBoot, 1100);
		window.addEventListener('pointerdown', finishBoot, { passive: true, once: true });
		window.addEventListener('keydown', finishBoot, { passive: true, once: true });

		return () => {
			if (timer !== undefined) {
				clearTimeout(timer);
			}
			if (spinTimer !== undefined) {
				clearInterval(spinTimer);
			}
			window.removeEventListener('pointerdown', finishBoot);
			window.removeEventListener('keydown', finishBoot);
		};
	});
</script>

{#if !booted}
	<div
		class="term-boot-overlay fixed inset-0 z-[60] m-0! h-dvh w-screen bg-term-bg flex items-center px-4 sm:px-8 lg:px-10 font-term-mono text-[16px] md:text-[18px] leading-[1.7] select-none"
		aria-hidden="true"
	>
		<div class="w-full max-w-[46ch] space-y-2">
			<p class="boot-line text-term-fg font-bold" style="--i: 0;">
				<span class="text-term-accent">&gt;_</span> kantz-workstation
				<span class="text-term-accent font-normal">v{__APP_VERSION__}</span>
			</p>
			<p class="boot-line text-term-muted" style="--i: 1;">
				build <span class="text-term-info">{__COMMIT__}</span> ({__BUILD_DATE__})
			</p>
			<p class="boot-line text-term-fg" style="--i: 2;">
				<span class="text-term-info inline-block w-3">{SPINNER_FRAMES[spinIndex]}</span> mounting
				public routes... <span class="text-term-ok">[ok]</span>
			</p>
			<div class="boot-line pt-1" style="--i: 1;">
				<div class="h-[2px] w-full bg-term-border overflow-hidden">
					<div class="boot-progress-fill h-full w-full"></div>
				</div>
			</div>
			<p class="boot-line text-term-muted text-[14px]" style="--i: 3;">
				session ready -- press any key or click to skip
			</p>
		</div>
	</div>
{/if}

<section
	aria-label="Message of the day"
	class="font-term-mono text-[14px] md:text-[16px] leading-[1.5] pb-2.5 border-b border-term-border flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5"
>
	<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
		<span class="inline-flex items-center gap-2 text-term-ok text-[13px] md:text-[14px]">
			<span class="term-pulse-dot" aria-hidden="true"></span>
			<span>session: active</span>
		</span>
		<span class="text-term-faint hidden sm:inline" aria-hidden="true">|</span>
		<p class="text-term-fg">
			<span class="font-bold">kantz-workstation</span>
			<span class="text-term-accent ml-1">v{__APP_VERSION__}</span>
			<span class="text-term-muted ml-2">
				build <span class="text-term-info">{__COMMIT__}</span> ({__BUILD_DATE__})
			</span>
		</p>
	</div>
	<p class="text-term-muted text-[14px] md:text-[15px]">
		type <span class="text-term-accent">help</span>, or use the bar below
	</p>
</section>
