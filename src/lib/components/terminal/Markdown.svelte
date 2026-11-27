<script lang="ts">
	import './markdown.css';
	import { renderMarkdown } from '#lib/utils/markdown';

	interface Props {
		content: string;
		class?: string;
	}

	let { content, class: className = '' }: Props = $props();

	let html = $derived(renderMarkdown(content));
</script>

<div class="md {className}">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</div>
