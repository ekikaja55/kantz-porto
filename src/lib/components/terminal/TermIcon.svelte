<script lang="ts">
	/**
	 * TermIcon - Functional inline SVG icon component for Terminal UI
	 * Icon source: Pixelarticons (MIT License - Copyright (c) Gerrit Halfmann)
	 */
	export type IconName = 'external-link' | 'copy' | 'check' | 'close' | 'search';

	interface Props {
		name: IconName;
		size?: number | string;
		class?: string;
	}

	let { name, size = 16, class: className = '' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="currentColor"
	aria-hidden="true"
	class="inline-block shrink-0 {className}"
>
	{#if name === 'external-link'}
		<path d="M11 5H5v2h6zM5 7H3v12h2zm12 12H5v2h12zm2-6h-2v6h2zm-8 0H9v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v2h2zm2-2h-2v8h2z" />
		<path d="M21 3h-8v2h8z" />
	{:else if name === 'copy'}
		<path d="M8 6h12v2H8zM4 2h12v2H4zm2 6h2v12H6zM2 4h2v12H2zm6 16h12v2H8zM20 8h2v12h-2zm-4-4h2v2h-2zM4 16h2v2H4z" />
	{:else if name === 'check'}
		<path d="M10 18H8v-2h2zm-2-2H6v-2h2zm4-2v2h-2v-2zm-6 0H4v-2h2zm8 0h-2v-2h2zm2-2h-2v-2h2zm2-2h-2V8h2zm2-2h-2V6h2z" />
	{:else if name === 'close'}
		<path d="M7 19H5v-2h2zm12 0h-2v-2h2zM9 15v2H7v-2zm8 2h-2v-2h2zm-6-2H9v-2h2zm4 0h-2v-2h2zm-2-2h-2v-2h2zm-2-2H9V9h2zm4 0h-2V9h2zM9 9H7V7h2zm8 0h-2V7h2zM7 7H5V5h2zm12 0h-2V5h2z" />
	{:else if name === 'search'}
		<path d="M22 22h-2v-2h2zm-2-2h-2v-2h2zm-6-2H6v-2h8zm4 0h-2v-2h2zM6 16H4v-2h2zm10 0h-2v-2h2zM4 14H2V6h2zm14 0h-2V6h2zM6 6H4V4h2zm10 0h-2V4h2zm-2-2H6V2h8z" />
	{/if}
</svg>
