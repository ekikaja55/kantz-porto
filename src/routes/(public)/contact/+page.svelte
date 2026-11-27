<script lang="ts">
	import { page } from '$app/state';
	import { PROFILE } from '#lib/constants/profile';
	import OutputBlock from '#lib/components/terminal/OutputBlock.svelte';
	import KeyValue, { type KeyValueItem } from '#lib/components/terminal/KeyValue.svelte';
	import { setStatusMessage } from '#lib/terminal/status.svelte';

	const description =
		'Contact information, communication channels, and external profiles for Rizki Arkant Pratama (Kantz).';

	function handleCopy(key: string) {
		if (key === 'email') {
			setStatusMessage('email copied');
		} else {
			setStatusMessage(`${key} copied`);
		}
	}

	const contactItems: KeyValueItem[] = [
		{
			key: 'email',
			value: PROFILE.email,
			href: `mailto:${PROFILE.email}`,
			copyable: true
		},
		{
			key: 'whatsapp',
			value: PROFILE.whatsapp.display,
			href: PROFILE.whatsapp.link,
			external: true
		},
		{
			key: 'github',
			value: PROFILE.github.username,
			href: PROFILE.github.link,
			external: true
		},
		{
			key: 'instagram',
			value: PROFILE.instagram.handle,
			href: PROFILE.instagram.link,
			external: true
		}
	];
</script>

<svelte:head>
	<title>contact | kantZ Workstation</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="contact | kantZ Workstation" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{page.url.origin}/og-default.png" />
</svelte:head>

<OutputBlock command="contact">
	<h1 class="sr-only">contact</h1>

	<div class="border-y border-term-border py-4 space-y-4">
		<div class="space-y-2">
			<KeyValue items={contactItems} oncopy={(_text, key) => handleCopy(key ?? 'item')} />

			<dl class="font-term-mono text-[16px] md:text-[18px] leading-[1.6]">
				<div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-0.5">
					<dt class="text-term-muted">availability</dt>
					<dd class="min-w-0 text-term-fg break-words flex items-center gap-2.5">
						<span class="term-pulse-dot" aria-hidden="true"></span>
						<span>open for full-stack engineering &amp; architecture inquiries</span>
					</dd>
				</div>
			</dl>
		</div>

		{#if PROFILE.photo}
			<figure
				class="term-reticle group w-[200px] sm:w-[228px] border border-term-border bg-term-surface p-1.5 space-y-1.5"
			>
				<span
					aria-hidden="true"
					class="term-reticle-corner -top-px -left-px border-t-2 border-l-2"
				></span>
				<span
					aria-hidden="true"
					class="term-reticle-corner -top-px -right-px border-t-2 border-r-2"
				></span>
				<span
					aria-hidden="true"
					class="term-reticle-corner -bottom-px -left-px border-b-2 border-l-2"
				></span>
				<span
					aria-hidden="true"
					class="term-reticle-corner -bottom-px -right-px border-b-2 border-r-2"
				></span>
				<img
					src={PROFILE.photo}
					alt={PROFILE.name}
					width="400"
					height="400"
					loading="lazy"
					decoding="async"
					class="w-full aspect-square object-cover block brightness-95 group-hover:brightness-100 transition-all duration-200"
				/>
				<figcaption
					class="font-term-mono text-[12px] leading-[1.3] text-term-muted flex items-center justify-between gap-2"
				>
					<span class="truncate text-term-info">{PROFILE.alias.toLowerCase()}.jpeg</span>
					<span class="tabular-nums shrink-0 text-term-muted">1:1</span>
				</figcaption>
			</figure>
		{/if}
	</div>
</OutputBlock>
