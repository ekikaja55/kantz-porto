<script lang="ts">
	import Icon from '@iconify/svelte';
	import { i18n } from '#lib/i18n/index.svelte';

	let copied = $state(false);
	const email = 'rizkiarkant55@gmail.com';

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(email);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			// fallback
		}
	}
</script>

<section id="contact" class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
	<div class="rounded-2xl border border-neutral-200/90 bg-neutral-100/50 p-8 sm:p-12 dark:border-neutral-800/90 dark:bg-neutral-900/40">
		<div class="max-w-2xl">
			<h2 class="font-display text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
				{i18n.t.contact.title}
			</h2>
			<p class="mt-3 text-base text-neutral-600 dark:text-neutral-400">
				{i18n.t.contact.subtitle}
			</p>
		</div>

		<div class="mt-8 flex flex-wrap items-center gap-4">
			<div class="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-mono text-sm text-neutral-800 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
				<Icon icon="solar:letter-bold-duotone" class="size-4 text-neutral-500" />
				<span>{email}</span>
			</div>

			<button
				type="button"
				onclick={copyEmail}
				class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
			>
				<Icon icon={copied ? 'solar:check-circle-bold-duotone' : 'solar:copy-bold-duotone'} class={`size-4 ${copied ? 'text-emerald-500' : ''}`} />
				<span>{copied ? i18n.t.common.copied : i18n.t.common.copy}</span>
			</button>

			<a
				href={`mailto:${email}`}
				class="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-400 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
			>
				<Icon icon="solar:plain-bold-duotone" class="size-4" />
				<span>{i18n.t.contact.directMessage}</span>
			</a>
		</div>

		<div class="mt-8 flex items-center gap-4 border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
			<span class="text-xs font-mono uppercase text-neutral-500">
				{i18n.t.contact.socials}:
			</span>
			<a
				href="https://github.com/ekikaja55"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:underline dark:text-neutral-300"
			>
				<Icon icon="solar:code-file-bold-duotone" class="size-3.5" />
				<span>GitHub</span>
			</a>
			<a
				href="https://instagram.com/filenya_ekik.zip"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:underline dark:text-neutral-300"
			>
				<Icon icon="solar:camera-bold-duotone" class="size-3.5" />
				<span>Instagram</span>
			</a>
		</div>
	</div>
</section>
