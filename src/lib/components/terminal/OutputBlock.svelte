<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		command: string;
		class?: string;
		children: Snippet;
	}

	let { command, class: className = '', children }: Props = $props();

	function replayOnCommandChange(node: HTMLElement, initialCommand: string) {
		let prev = initialCommand;
		return {
			update(next: string) {
				if (next === prev) return;
				prev = next;
				node.classList.remove('term-enter');
				void node.offsetWidth;
				node.classList.add('term-enter');
			}
		};
	}
</script>

<section use:replayOnCommandChange={command} class="term-enter space-y-4 {className}">
	<div
		class="font-term-mono text-[15px] md:text-[17px] leading-[1.5] break-all select-none flex items-baseline gap-2"
		aria-hidden="true"
	>
		<span class="term-echo-dollar text-term-accent font-bold">$</span>
		<span class="text-term-fg">{command}</span>
	</div>

	<div class="space-y-4">
		{@render children()}
	</div>
</section>
