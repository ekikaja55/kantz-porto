<script lang="ts">
	import Iconify from '@iconify/svelte';

	interface Props {
		name: string;
		size?: number;
		color?: string;
		class?: string;
		desktopShadow?: boolean;
	}

	let {
		name,
		size = 24,
		color = 'currentColor',
		class: className = '',
		desktopShadow = false
	}: Props = $props();

	// Map generic or standard names to pixelarticons
	const iconMap: Record<string, string> = {
		computer: 'pixelarticons:device-laptop',
		folder: 'pixelarticons:folder',
		'folder-open': 'pixelarticons:folder-minus',
		file: 'pixelarticons:file-text',
		document: 'pixelarticons:file-text',
		code: 'pixelarticons:code',
		briefcase: 'pixelarticons:briefcase',
		projects: 'pixelarticons:viewport-wide',
		skills: 'pixelarticons:sliders-2',
		experience: 'pixelarticons:bookmark',
		contact: 'pixelarticons:mail',
		mail: 'pixelarticons:mail',
		trash: 'pixelarticons:trash',
		'recycle-bin': 'pixelarticons:trash',
		help: 'pixelarticons:help',
		settings: 'pixelarticons:sliders',
		run: 'pixelarticons:forward',
		shutdown: 'pixelarticons:power',
		external: 'pixelarticons:external-link',
		github: 'pixelarticons:git-branch',
		user: 'pixelarticons:user',
		clock: 'pixelarticons:clock',
		volume: 'pixelarticons:volume',
		check: 'pixelarticons:check',
		close: 'pixelarticons:close',
		info: 'pixelarticons:info-box',
		warning: 'pixelarticons:alert',
		error: 'pixelarticons:close-box'
	};

	let iconId = $derived(iconMap[name] || (name.includes(':') ? name : `pixelarticons:${name}`));
</script>

<span
	class="inline-flex items-center justify-center shrink-0 {className}"
	style:width="{size}px"
	style:height="{size}px"
	style:image-rendering="pixelated"
	style:filter={desktopShadow ? 'drop-shadow(1px 1px 0 #000000)' : undefined}
>
	<Iconify icon={iconId} width={size} height={size} style="color: {color};" />
</span>
