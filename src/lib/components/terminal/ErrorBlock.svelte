<script lang="ts">
	interface Props {
		input?: string;
		message?: string;
		suggestions?: readonly string[] | string[];
		hint?: string;
		class?: string;
	}

	let {
		input = '',
		message,
		suggestions = [],
		hint = 'type help for the list',
		class: className = ''
	}: Props = $props();
</script>

<div class="space-y-2 font-term-mono text-[15px] md:text-[17px] leading-[1.55] {className}">
	<p class="text-term-danger">
		{message ?? `command not found: ${input}`}
	</p>

	{#if suggestions.length > 0}
		<p class="text-term-muted">
			did you mean: <span class="text-term-info">{suggestions.join(', ')}</span>
		</p>
	{/if}

	{#if hint}
		<p class="text-term-muted">
			{hint}
		</p>
	{/if}
</div>
