<script lang="ts">
	import Icon from './Icon.svelte';
	import StartMenu from './StartMenu.svelte';

	interface TaskItem {
		id: string;
		title: string;
		icon: string;
		active: boolean;
	}

	interface Props {
		tasks?: TaskItem[];
		lang?: 'id' | 'en';
		onstartitem?: (id: string) => void;
		ontaskclick?: (id: string) => void;
		ontogglelang?: () => void;
	}

	let {
		tasks = [],
		lang = 'id',
		onstartitem,
		ontaskclick,
		ontogglelang
	}: Props = $props();

	let startOpen = $state(false);
	let currentTime = $state('');
	let currentDate = $state('');
	let taskPage = $state(0);
	const maxTasksPerPage = 4;

	let visibleTasks = $derived.by(() => {
		const start = taskPage * maxTasksPerPage;
		return tasks.slice(start, start + maxTasksPerPage);
	});

	function updateTime() {
		const now = new Date();
		let hours = now.getHours();
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;
		currentTime = `${hours}:${minutes} ${ampm}`;
		currentDate = now.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	$effect(() => {
		updateTime();
		const interval = setInterval(updateTime, 10000);
		return () => clearInterval(interval);
	});
</script>

<!-- Start Menu component -->
<StartMenu
	open={startOpen}
	onclose={() => (startOpen = false)}
	onselectitem={(id) => {
		startOpen = false;
		onstartitem?.(id);
	}}
/>

<!-- 34px Taskbar -->
<div
	class="fixed bottom-0 left-0 right-0 z-40 flex items-center h-[34px] px-[3px] bg-[#C0C0C0] border-t border-t-white shadow-[0_-1px_0_#808080] select-none text-black"
	role="navigation"
	aria-label="Taskbar"
>
	<!-- Start Button -->
	<button
		type="button"
		onclick={() => (startOpen = !startOpen)}
		aria-expanded={startOpen}
		class="flex items-center gap-1.5 h-[26px] px-2.5 text-[12px] font-bold text-black focus:outline-none {startOpen
			? 'win-pressed win-dither translate-x-[1px] translate-y-[1px]'
			: 'win-raised active:win-pressed'}"
	>
		<!-- Retro Pixel Monogram "K" for Kantz OS -->
		<span class="inline-flex items-center justify-center w-4 h-4 bg-[#000080] text-white font-bold text-[10px] shrink-0" style="box-shadow: inset 1px 1px #FFFFFF, inset -1px -1px #000000;">
			K
		</span>
		<span>Start</span>
	</button>

	<!-- Quick Launch Divider -->
	<div class="flex items-center gap-1 px-1.5 ml-1 border-l border-[#808080] border-r border-white h-5 shrink-0">
		<button
			type="button"
			title="Show Desktop"
			onclick={() => onstartitem?.('desktop')}
			class="p-0.5 hover:win-raised-sm active:win-sunken-sm"
		>
			<Icon name="computer" size={16} color="#808080" />
		</button>
		<button
			type="button"
			title="Projects"
			onclick={() => onstartitem?.('projects')}
			class="p-0.5 hover:win-raised-sm active:win-sunken-sm"
		>
			<Icon name="projects" size={16} color="#000080" />
		</button>
	</div>

	<!-- Running Tasks List with Navigation Controls for mobile overflow -->
	<div class="flex items-center gap-1 flex-1 overflow-hidden px-1 h-full min-w-0">
		{#if taskPage > 0}
			<button
				type="button"
				aria-label="Previous tasks"
				onclick={() => (taskPage -= 1)}
				class="win-raised flex items-center justify-center w-5 h-[26px] shrink-0 text-[10px] active:win-pressed"
			>
				&lt;
			</button>
		{/if}

		<div class="flex items-center gap-1 flex-1 overflow-x-auto h-full min-w-0">
			{#each visibleTasks as task (task.id)}
				<button
					type="button"
					onclick={() => ontaskclick?.(task.id)}
					class="flex items-center gap-1.5 h-[26px] max-w-[170px] min-w-[100px] flex-1 px-2 text-[12px] text-left truncate {task.active
						? 'win-pressed win-dither font-bold'
						: 'win-raised active:win-pressed'}"
				>
					<Icon name={task.icon} size={16} />
					<span class="truncate">{task.title}</span>
				</button>
			{/each}
		</div>

		{#if (taskPage + 1) * maxTasksPerPage < tasks.length}
			<button
				type="button"
				aria-label="Next tasks"
				onclick={() => (taskPage += 1)}
				class="win-raised flex items-center justify-center w-5 h-[26px] shrink-0 text-[10px] active:win-pressed"
			>
				&gt;
			</button>
		{/if}
	</div>

	<!-- System Tray -->
	<div
		class="win-sunken-sm flex items-center gap-2 h-[26px] px-2 ml-1 shrink-0 bg-[#C0C0C0] text-[12px]"
	>
		<!-- Volume Icon -->
		<span title="Volume" class="cursor-default">
			<Icon name="volume" size={15} color="#000000" />
		</span>

		<!-- Language indicator button (ID/EN) -->
		<button
			type="button"
			title="Toggle Language (ID/EN)"
			onclick={ontogglelang}
			class="font-bold hover:underline cursor-pointer uppercase tracking-wider text-[11px] px-0.5"
		>
			{lang}
		</button>

		<!-- Live Digital Clock with Date Tooltip -->
		<div class="flex items-center gap-1 font-mono text-[12px] px-1 cursor-default" title={currentDate}>
			<Icon name="clock" size={14} color="#000000" />
			<span>{currentTime}</span>
		</div>
	</div>
</div>
