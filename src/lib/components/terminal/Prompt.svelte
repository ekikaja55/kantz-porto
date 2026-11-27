<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		path?: string;
		class?: string;
	}

	let { path, class: className = '' }: Props = $props();

	const currentPath = $derived.by(() => {
		if (path !== undefined) return path;
		const pathname = page.url.pathname;
		if (pathname === '/' || pathname === '') return '~';
		if (pathname.startsWith('/projects')) {
			if (pathname === '/projects') return '~/projects';
			const slug = pathname.replace('/projects/', '');
			return `~/projects/${slug}`;
		}
		if (pathname.startsWith('/skills')) return '~/skills';
		if (pathname.startsWith('/experience')) return '~/experience';
		if (pathname.startsWith('/contact')) return '~/contact';
		return '~';
	});
</script>

<span
	class="inline-flex items-center shrink-0 max-w-[42vw] sm:max-w-none whitespace-nowrap font-term-mono text-[15px] md:text-[17px] leading-[1.5] select-none {className}"
>
	<span class="hidden sm:inline text-term-muted">kantz@workstation:</span><span
		class="text-term-info truncate"
		>{currentPath}</span
	><span class="text-term-accent shrink-0">$</span>
</span>
