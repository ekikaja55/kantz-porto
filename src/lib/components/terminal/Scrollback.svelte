<script lang="ts">
	import type { Snippet } from 'svelte';
	import { COMMAND_REGISTRY, formatCommandUsage } from '#lib/terminal/commands';
	import { getScrollback } from '#lib/terminal/scrollback.svelte';
	import OutputBlock from './OutputBlock.svelte';
	import ErrorBlock from './ErrorBlock.svelte';
	import Kbd from './Kbd.svelte';

	interface Props {
		sampleSlug?: string;
		onrunexample?: (command: string) => void;
		children: Snippet;
	}

	let { sampleSlug = 'invoizy', onrunexample, children }: Props = $props();

	const blocks = $derived(getScrollback());
	const helpCommands = COMMAND_REGISTRY.filter((cmd) => cmd.id !== 'sudo');
	const exampleCommands = $derived([
		{ cmd: `open ${sampleSlug}`, note: 'open a project case study directly' },
		{ cmd: 'theme ayu', note: 'switch to the Ayu Dark palette' },
		{ cmd: 'history', note: 'inspect commands typed this session' }
	]);

	function scrollBlockIntoView(node: HTMLElement) {
		if (typeof node.scrollIntoView === 'function') {
			node.scrollIntoView({ block: 'start', behavior: 'instant' });
		}
	}
</script>

<div class="space-y-6">
	{@render children()}
</div>

<div aria-live="polite" class="mt-6 space-y-6 empty:hidden">
	{#each blocks as block (block.id)}
		<div use:scrollBlockIntoView class="scroll-mt-6">
			<OutputBlock command={block.echo}>
				{#if block.payload.type === 'help'}
					<div class="space-y-5 font-term-mono text-[15px] md:text-[17px] leading-[1.55]">
						<div class="space-y-1.5">
							<p class="text-term-muted">commands:</p>
							<dl class="space-y-1.5">
								{#each helpCommands as cmd (cmd.id)}
									<div class="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-x-4">
										<dt class="text-term-fg">
											{formatCommandUsage(cmd)}{#if cmd.aliases.length > 0}<span class="text-term-muted">
													({cmd.aliases.join(', ')})</span
												>{/if}
										</dt>
										<dd class="text-term-muted">{cmd.description}</dd>
									</div>
								{/each}
							</dl>
						</div>

						<div class="space-y-1.5">
							<p class="text-term-muted">examples (click to run):</p>
							<dl class="space-y-1.5">
								{#each exampleCommands as ex (ex.cmd)}
									<div class="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-x-4 items-baseline">
										<dt>
											<button
												type="button"
												onclick={() => onrunexample?.(ex.cmd)}
												class="text-term-info underline hover:text-term-accent cursor-pointer text-left"
											>
												$ {ex.cmd}
											</button>
										</dt>
										<dd class="text-term-muted">{ex.note}</dd>
									</div>
								{/each}
							</dl>
						</div>

						<div class="space-y-1.5">
							<p class="text-term-muted">keys:</p>
							<dl class="space-y-1.5">
								<div class="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-x-4 items-baseline">
									<dt class="flex items-center gap-1">
										<Kbd key="Up" />
										<span class="text-term-muted">/</span>
										<Kbd key="Down" />
									</dt>
									<dd class="text-term-muted">walk typed history</dd>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-x-4 items-baseline">
									<dt class="flex items-center gap-1">
										<Kbd key="Tab" />
										<span class="text-term-muted">/</span>
										<Kbd key="Right" />
									</dt>
									<dd class="text-term-muted">complete command or accept inline suggestion</dd>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-x-4 items-baseline">
									<dt><Kbd key="Enter" /></dt>
									<dd class="text-term-muted">run command</dd>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-x-4 items-baseline">
									<dt><Kbd key="Ctrl+L" /></dt>
									<dd class="text-term-muted">clear appended blocks</dd>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-x-4 items-baseline">
									<dt><Kbd key="Esc" /></dt>
									<dd class="text-term-muted">close mobile menu drawer</dd>
								</div>
							</dl>
						</div>
					</div>
				{:else if block.payload.type === 'history'}
					{#if block.payload.entries.length === 0}
						<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-muted">
							no commands typed this session
						</p>
					{:else}
						<ol class="space-y-1 font-term-mono text-[15px] md:text-[17px] leading-[1.55]">
							{#each block.payload.entries as entry, idx (`${idx}-${entry.time}-${entry.command}`)}
								<li class="flex items-baseline gap-3">
									<span class="w-7 text-right tabular-nums text-term-faint select-none">
										{idx + 1}
									</span>
									<span class="tabular-nums text-term-muted shrink-0">{entry.time}</span>
									<span class="text-term-fg break-all">{entry.command}</span>
								</li>
							{/each}
						</ol>
					{/if}
				{:else if block.payload.type === 'theme'}
					<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-fg">
						theme: <span class="text-term-accent">{block.payload.theme}</span>
					</p>
				{:else if block.payload.type === 'info'}
					<p class="font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-muted">
						{block.payload.text}
					</p>
				{:else if block.payload.type === 'unknown'}
					<ErrorBlock
						input={block.payload.input}
						suggestions={block.payload.suggestions}
						hint="type help for the list"
					/>
				{:else if block.payload.type === 'bad-args'}
					<ErrorBlock message="usage: {block.payload.usage}" hint="" />
				{:else if block.payload.type === 'candidates'}
					<div
						class="flex flex-wrap gap-x-5 gap-y-1.5 font-term-mono text-[15px] md:text-[17px] leading-[1.55] text-term-info"
					>
						{#each block.payload.items as item (item)}
							<span>{item}</span>
						{/each}
					</div>
				{/if}
			</OutputBlock>
		</div>
	{/each}
</div>
