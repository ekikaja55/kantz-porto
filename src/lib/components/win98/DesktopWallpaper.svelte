<script lang="ts">
	interface Props {
		theme?: 'dark-teal' | 'deep-slate';
		class?: string;
	}

	let { theme = 'dark-teal', class: className = '' }: Props = $props();

	let bgGradient = $derived(
		theme === 'deep-slate'
			? 'bg-gradient-to-br from-[#121B24] via-[#1B2A38] to-[#121B24]'
			: 'bg-gradient-to-br from-[#003B3B] via-[#004D4D] to-[#003333]'
	);
</script>

<!-- Authentic Desktop Wallpaper with Retro Dithered Watermark -->
<div class="absolute inset-0 pointer-events-none select-none overflow-hidden {bgGradient} {className}">
	<!-- Subtle CRT scanline overlay (authentic, non-blurry) -->
	<div
		class="absolute inset-0 opacity-[0.03]"
		style="background-image: repeating-linear-gradient(0deg, #000000, #000000 1px, transparent 1px, transparent 2px); background-size: 100% 2px;"
	></div>

	<!-- Asymmetric Bottom-Right Dithered Geometric Motif -->
	<div class="absolute bottom-12 right-6 opacity-20 flex flex-col items-end">
		<div class="font-bold tracking-widest text-white text-[28px]" style="font-family: 'WIN95FA', 'MS Sans Serif', sans-serif; -webkit-font-smoothing: none; text-shadow: 2px 2px 0 #000000;">
			Kantz OS
		</div>
		<div class="text-[12px] text-white/80 tracking-wider -mt-1" style="font-family: 'Cousine', monospace;">
			Workstation SE // 2026
		</div>
		<div class="flex items-center gap-1 mt-2">
			<span class="w-2 h-2 bg-white/40"></span>
			<span class="w-3 h-3 bg-white/60"></span>
			<span class="w-4 h-4 bg-white/80"></span>
			<span class="w-16 h-[2px] bg-white/40"></span>
		</div>
	</div>
</div>
