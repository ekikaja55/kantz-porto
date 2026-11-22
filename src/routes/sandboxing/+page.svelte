<script lang="ts">
	import '#lib/components/win98/win98.css';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Button from '#lib/components/win98/Button.svelte';
	import ChannelBar from '#lib/components/win98/ChannelBar.svelte';
	import DesktopIcon from '#lib/components/win98/DesktopIcon.svelte';
	import DesktopWallpaper from '#lib/components/win98/DesktopWallpaper.svelte';
	import Dialog from '#lib/components/win98/Dialog.svelte';
	import HtmlHelp from '#lib/components/win98/HtmlHelp.svelte';
	import Icon from '#lib/components/win98/Icon.svelte';
	import StatusBar from '#lib/components/win98/StatusBar.svelte';
	import Taskbar from '#lib/components/win98/Taskbar.svelte';
	import TreeView from '#lib/components/win98/TreeView.svelte';
	import Window from '#lib/components/win98/Window.svelte';
	import { PROFILE } from '#lib/constants/profile';
	import { renderMarkdown } from '#lib/utils/markdown';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Window state management
	type WinId = 'readme' | 'projects' | 'skills' | 'experiences' | 'contact' | 'settings';
	type WinState = { open: boolean; minimized: boolean; maximized: boolean };

	let windowStates = $state<Record<WinId, WinState>>({
		readme: { open: true, minimized: false, maximized: false },
		projects: { open: false, minimized: false, maximized: false },
		skills: { open: false, minimized: false, maximized: false },
		experiences: { open: false, minimized: false, maximized: false },
		contact: { open: false, minimized: false, maximized: false },
		settings: { open: false, minimized: false, maximized: false }
	});

	let activeWindow = $state<WinId | ''>('readme');
	let selectedIcon = $state<string | null>('readme');

	// Dynamic Z-Index stack
	let maxZ = $state(15);
	let windowZ = $state<Record<WinId, number>>({
		readme: 10,
		projects: 11,
		skills: 12,
		experiences: 13,
		contact: 14,
		settings: 15
	});

	function bringToFront(id: WinId) {
		maxZ += 1;
		windowZ[id] = maxZ;
		activeWindow = id;
		selectedIcon = id;
	}

	function toggleMaximize(id: WinId) {
		windowStates[id].maximized = !windowStates[id].maximized;
		bringToFront(id);
	}

	// Active Language (EN / ID)
	let lang = $state<'en' | 'id'>('en');

	// Wallpaper Theme
	let wallpaperTheme = $state<'dark-teal' | 'deep-slate'>('dark-teal');

	// Reduced Motion Preference
	let reducedMotion = $state(false);

	// Settings Tab
	let settingsTab = $state<'appearance' | 'language' | 'effects'>('appearance');

	// Channel Bar Drawer State
	let channelDrawerOpen = $state(true);

	// System state for shutdown sequence
	type SystemState = 'desktop' | 'safe-to-turn-off' | 'msdos';
	let systemState = $state<SystemState>('desktop');
	let shutdownSelected = $state<'shutdown' | 'restart' | 'dos'>('shutdown');
	let shutdownDialogOpen = $state(false);

	// MS-DOS interactive CLI terminal
	let dosInput = $state('');
	let dosHistory = $state<Array<{ cmd: string; output: string[] }>>([
		{
			cmd: '',
			output: [
				'Starting MS-DOS 7.1...',
				'KANTZ-DOS (C) Copyright Rizki Arkant Pratama 2026.',
				'Type "HELP" for a list of commands, or "WIN" to return to Kantz OS.'
			]
		}
	]);

	// Dialog states
	let cvDialogOpen = $state(false);
	let contactFeedbackDialog = $state(false);
	let contactFeedback = $state<{ type: 'info' | 'error'; title: string; message: string }>({
		type: 'info',
		title: 'Information',
		message: ''
	});

	// Boot splash (once per session, respecting reduced motion)
	let showSplash = $state(false);
	onMount(() => {
		if (typeof sessionStorage !== 'undefined') {
			const hasBooted = sessionStorage.getItem('win98-booted');
			const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (!hasBooted && !osReduced && !reducedMotion) {
				showSplash = true;
				const t = setTimeout(() => {
					if (showSplash) dismissSplash();
				}, 2500);
				return () => clearTimeout(t);
			}
		}
	});

	function dismissSplash() {
		showSplash = false;
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.setItem('win98-booted', '1');
		}
	}

	// Contact form state
	let contactName = $state('');
	let contactEmail = $state('');
	let contactMessage = $state('');
	let contactHoneypot = $state('');
	let contactSending = $state(false);
	let contactSent = $state(false);

	// CV lang selection
	let cvLang = $state<'en' | 'id'>('en');

	// Projects view mode
	let projectView = $state<'details' | 'icons'>('details');

	// Selected project for web-view pane
	let selectedProjectId = $state<string | null>(null);
	let selectedProject = $derived(
		selectedProjectId ? data.projects.find((p) => p.id === selectedProjectId) ?? null : null
	);

	// Dynamic Explorer address
	let explorerAddress = $derived.by(() => {
		if (selectedProject) {
			return `C:\\Kantz\\Projects\\${selectedProject.id}`;
		}
		return 'C:\\Kantz\\Projects';
	});

	// Experience TOC selection
	let selectedExpId = $state<string | null>(null);

	// URL sync helper (Opsi B: URL as source of truth)
	function updateUrlForWindow(id: string) {
		if (typeof window === 'undefined') return;
		const query = id && id !== 'readme' ? `?app=${id}` : '';
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(`${resolve('/sandboxing')}${query}`, { replace: true, shallow: true });
	}

	// Sync active window from URL on mount/change
	$effect(() => {
		const appParam = page.url.searchParams.get('app') as WinId | null;
		if (appParam && windowStates[appParam]) {
			windowStates[appParam].open = true;
			windowStates[appParam].minimized = false;
			bringToFront(appParam);
		}
	});

	// Window helpers
	function openWindow(id: string) {
		if (id === 'cv') {
			cvDialogOpen = true;
			return;
		}
		if (id === 'shutdown') {
			shutdownDialogOpen = true;
			return;
		}
		const wid = id as WinId;
		if (windowStates[wid]) {
			windowStates[wid].open = true;
			windowStates[wid].minimized = false;
		}
		bringToFront(wid);
		updateUrlForWindow(wid);
	}

	function closeWindow(id: WinId) {
		windowStates[id].open = false;
		if (activeWindow === id) {
			const remaining = (Object.keys(windowStates) as WinId[]).filter(
				(k) => windowStates[k].open && !windowStates[k].minimized
			);
			if (remaining.length > 0) {
				bringToFront(remaining[0]);
				updateUrlForWindow(remaining[0]);
			} else {
				activeWindow = '';
				updateUrlForWindow('');
			}
		}
	}

	function toggleMinimize(id: WinId) {
		windowStates[id].minimized = !windowStates[id].minimized;
		if (!windowStates[id].minimized) {
			bringToFront(id);
			updateUrlForWindow(id);
		}
	}

	function focusWindow(id: WinId) {
		windowStates[id].minimized = false;
		bringToFront(id);
		updateUrlForWindow(id);
	}

	function handleDesktopClick() {
		selectedIcon = null;
	}

	function toggleLanguage() {
		lang = lang === 'en' ? 'id' : 'en';
	}

	// Shutdown confirmation handler
	function handleShutdownConfirm() {
		shutdownDialogOpen = false;
		if (shutdownSelected === 'shutdown') {
			systemState = 'safe-to-turn-off';
		} else if (shutdownSelected === 'restart') {
			showSplash = true;
			systemState = 'desktop';
			setTimeout(() => {
				dismissSplash();
			}, 2500);
		} else if (shutdownSelected === 'dos') {
			systemState = 'msdos';
		}
	}

	// MS-DOS interactive CLI input handler
	function handleDosSubmit(e: SubmitEvent) {
		e.preventDefault();
		const cmd = dosInput.trim();
		const lower = cmd.toLowerCase();
		dosInput = '';

		if (lower === 'cls' || lower === 'clear') {
			dosHistory = [];
			return;
		}
		if (lower === 'win' || lower === 'exit') {
			systemState = 'desktop';
			return;
		}

		let output: string[];
		if (lower === 'help') {
			output = [
				'Supported commands:',
				'  HELP       Displays this command reference list',
				'  PROJECTS   Launch Projects Explorer',
				'  SKILLS     Open Device Manager (Technical Skills)',
				'  CONTACT    Open Contact Message vCard',
				'  CV         Dispatch PDF Curriculum Vitae download',
				'  VER        Display Kantz-DOS system version',
				'  CLS        Clear terminal screen',
				'  WIN        Return to Kantz OS Desktop'
			];
		} else if (lower === 'projects') {
			systemState = 'desktop';
			openWindow('projects');
			return;
		} else if (lower === 'skills') {
			systemState = 'desktop';
			openWindow('skills');
			return;
		} else if (lower === 'contact') {
			systemState = 'desktop';
			openWindow('contact');
			return;
		} else if (lower === 'cv') {
			window.open(cvLang === 'id' ? '/cv/cv-kantz-id.pdf' : '/cv/cv-kantz-en.pdf', '_blank');
			output = ['Curriculum Vitae download initialized in browser.'];
		} else if (lower === 'ver') {
			output = ['Kantz-DOS Version 7.10 (Architecture SE-2026)'];
		} else if (lower === '') {
			output = [];
		} else {
			output = [`Bad command or file name: "${cmd}"`];
		}

		dosHistory.push({ cmd, output });
	}

	// Taskbar task list
	const WIN_TITLES: Record<WinId, { title: string; icon: string }> = {
		readme: { title: 'README.txt - Notepad', icon: 'document' },
		projects: { title: 'C:\\Kantz\\Projects', icon: 'projects' },
		skills: { title: 'System Properties', icon: 'skills' },
		experiences: { title: 'Experiences - HTML Help', icon: 'experience' },
		contact: { title: 'New Message', icon: 'contact' },
		settings: { title: 'Display Properties', icon: 'settings' }
	};

	let taskList = $derived(
		(Object.keys(windowStates) as WinId[])
			.filter((k) => windowStates[k].open)
			.map((id) => ({
				id,
				title: WIN_TITLES[id].title,
				icon: WIN_TITLES[id].icon,
				active: activeWindow === id && !windowStates[id].minimized
			}))
	);

	// Skills tree nodes
	let skillTree = $derived.by(() => {
		const catMap: Record<string, Array<{ id: string; label: string }>> = {};
		for (const s of data.skills) {
			const cat = s.category || 'General';
			if (!catMap[cat]) catMap[cat] = [];
			catMap[cat].push({ id: s.id, label: s.name });
		}
		return Object.entries(catMap).map(([cat, items]) => ({
			id: `cat-${cat}`,
			label: `${cat} Subsystems`,
			icon: 'folder' as const,
			iconColor: '#D97706',
			children: items.map((i) => ({ id: i.id, label: i.label, icon: 'file' as const }))
		}));
	});

	// Experiences TOC
	let expToc = $derived(
		data.experiences.map((exp) => ({
			id: exp.id,
			label: exp.company,
			children: [{ id: `${exp.id}-role`, label: exp.role }]
		}))
	);

	// Selected experience entry
	let selectedExp = $derived(
		selectedExpId
			? data.experiences.find(
					(e) => e.id === selectedExpId || `${e.id}-role` === selectedExpId
				) ?? null
			: null
	);

	// Channel bar items from featured projects
	let channelItems = $derived(
		data.featuredProjects.map((p) => ({
			id: p.id,
			title: p.title,
			tagline: p.description?.slice(0, 65),
			tech: Array.isArray(p.technologies) ? (p.technologies as string[]) : [],
			liveUrl: p.liveUrl ?? undefined
		}))
	);
</script>

<svelte:head>
	<title>Kantz OS - Workstation SE</title>
	<meta name="robots" content="noindex" />
	<link rel="alternate" hreflang="en" href="/sandboxing" />
	<link rel="alternate" hreflang="id" href="/sandboxing" />
</svelte:head>

<!-- Safe To Turn Off Screen -->
{#if systemState === 'safe-to-turn-off'}
	<div class="fixed inset-0 z-[99999] bg-[#000000] text-[#FF9900] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
		<div class="border-2 border-[#FF9900] p-8 max-w-lg shadow-[0_0_20px_rgba(255,153,0,0.3)]">
			<h1 class="text-[24px] font-bold tracking-widest uppercase mb-4" style="text-shadow: 2px 2px 0 #000000;">
				It is now safe to turn off your computer.
			</h1>
			<p class="text-[13px] text-[#FF9900]/80 mb-6">
				All system processes terminated. Session data cached in workstation memory.
			</p>
			<Button
				variant="pressed"
				onclick={() => {
					systemState = 'desktop';
					showSplash = true;
					setTimeout(() => dismissSplash(), 2200);
				}}
				class="text-[13px] px-4 py-1.5 font-bold text-black"
			>
				Power On / Restart System
			</Button>
		</div>
	</div>
{/if}

<!-- MS-DOS Interactive CLI Mode -->
{#if systemState === 'msdos'}
	<div class="fixed inset-0 z-[99999] bg-[#000000] text-[#DFDFDF] font-mono p-4 flex flex-col text-[14px] leading-relaxed overflow-hidden">
		<div class="flex-1 overflow-y-auto space-y-2">
			{#each dosHistory as item, idx (idx)}
				{#if item.cmd}
					<div>
						<span class="text-white font-bold">C:\KANTZ&gt;</span>
						<span>{item.cmd}</span>
					</div>
				{/if}
				{#each item.output as outLine, j (j)}
					<div class="text-[#AAAAAA]">{outLine}</div>
				{/each}
			{/each}

			<form onsubmit={handleDosSubmit} class="flex items-center gap-2 pt-1">
				<span class="text-white font-bold shrink-0">C:\KANTZ&gt;</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					bind:value={dosInput}
					class="flex-1 bg-transparent text-white outline-none font-mono text-[14px]"
					autofocus
				/>
			</form>
		</div>
		<div class="text-[11px] text-[#808080] border-t border-[#333333] pt-1">
			Kantz-DOS Prompt // Type &quot;WIN&quot; to boot into Desktop GUI
		</div>
	</div>
{/if}

<!-- Boot Splash (BIOS + Segmented Progress Bar) -->
{#if showSplash}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#000000] select-none cursor-pointer"
		onclick={dismissSplash}
		onkeydown={(e) => (e.key === ' ' || e.key === 'Enter') && dismissSplash()}
	>
		<div class="text-center font-mono text-[#AAAAAA] max-w-md w-full px-4">
			<div class="text-left text-[11px] mb-8 text-[#808080] space-y-0.5">
				<div>KANTZ-BIOS (C) 2026 Kantz Workstation Systems</div>
				<div>Checking System Memory: 64MB OK</div>
				<div>Detecting Primary Master: QUANTUM FIREBALL 3.2GB</div>
				<div>Booting Kantz OS Workstation SE...</div>
			</div>

			<div class="text-[34px] font-bold text-white tracking-widest mb-1" style="font-family: 'WIN95FA', sans-serif;">
				Kantz<span class="text-[#1084D0]"> OS</span>
			</div>
			<div class="text-[12px] tracking-wider mb-6 text-[#DFDFDF]">Workstation Edition // 2026</div>

			<!-- Segmented progress bar -->
			<div class="w-[240px] h-[14px] win-sunken-field mx-auto p-[2px] bg-[#000000] mb-4">
				<div class="flex h-full gap-[2px]">
					<span class="w-3 bg-[#000080]"></span>
					<span class="w-3 bg-[#000080]"></span>
					<span class="w-3 bg-[#000080]"></span>
					<span class="w-3 bg-[#1084D0]"></span>
					<span class="w-3 bg-[#1084D0]"></span>
					<span class="w-3 bg-[#1084D0]"></span>
					<span class="w-3 bg-[#1084D0]"></span>
				</div>
			</div>

			<div class="text-[11px] text-[#808080]">Press any key or click to bypass boot sequence</div>
		</div>
	</div>
{/if}

<!-- Win98 Desktop Root -->
<main
	data-ui="win98"
	class="relative w-screen h-screen overflow-hidden select-none flex flex-col"
	style="color: #000000;"
>
	<!-- Authentic Desktop Wallpaper with Retro Dither -->
	<DesktopWallpaper theme={wallpaperTheme} />

	<!-- Skip-to-content link (accessibility) -->
	<a
		href="#main-content"
		class="sr-only focus:not-sr-only focus:absolute focus:top-1 focus:left-1 focus:z-50 focus:win-raised focus:px-3 focus:py-1 focus:text-[13px]"
	>
		Skip to content
	</a>

	<!-- Desktop Canvas Area -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		id="main-content"
		class="relative flex flex-1 overflow-hidden"
		onclick={handleDesktopClick}
	>
		<!-- Desktop Icons Column (top-left) -->
		<div class="grid grid-cols-3 sm:flex sm:flex-col gap-3 p-3 w-fit z-10 shrink-0 self-start">
			<DesktopIcon
				label="My Computer"
				icon="computer"
				iconColor="#C0C0C0"
				selected={selectedIcon === 'skills'}
				onselect={() => (selectedIcon = 'skills')}
				onopen={() => openWindow('skills')}
			/>
			<DesktopIcon
				label="README.txt"
				icon="document"
				iconColor="#FFFFFF"
				selected={selectedIcon === 'readme'}
				onselect={() => (selectedIcon = 'readme')}
				onopen={() => openWindow('readme')}
			/>
			<DesktopIcon
				label="Projects"
				icon="projects"
				iconColor="#D97706"
				selected={selectedIcon === 'projects'}
				onselect={() => (selectedIcon = 'projects')}
				onopen={() => openWindow('projects')}
			/>
			<DesktopIcon
				label="Experiences"
				icon="experience"
				iconColor="#000080"
				selected={selectedIcon === 'experiences'}
				onselect={() => (selectedIcon = 'experiences')}
				onopen={() => openWindow('experiences')}
			/>
			<DesktopIcon
				label="Contact.msg"
				icon="contact"
				iconColor="#808000"
				selected={selectedIcon === 'contact'}
				onselect={() => (selectedIcon = 'contact')}
				onopen={() => openWindow('contact')}
			/>
			<DesktopIcon
				label="Settings"
				icon="settings"
				iconColor="#000080"
				selected={selectedIcon === 'settings'}
				onselect={() => (selectedIcon = 'settings')}
				onopen={() => openWindow('settings')}
			/>
			<DesktopIcon
				label="CV_Kantz.pdf"
				icon="briefcase"
				iconColor="#000080"
				selected={selectedIcon === 'cv'}
				onselect={() => (selectedIcon = 'cv')}
				onopen={() => openWindow('cv')}
			/>
			<DesktopIcon
				label="Recycle Bin"
				icon="trash"
				iconColor="#808080"
				selected={selectedIcon === 'trash'}
				onselect={() => (selectedIcon = 'trash')}
				onopen={() => {}}
			/>
		</div>

		<!-- Windows Layer -->
		<div class="relative flex-1 overflow-hidden">
			<!-- Window: README.txt - Notepad (Home / About) -->
			{#if windowStates.readme.open && !windowStates.readme.minimized}
				<div
					class="win98-window-frame absolute shadow-[2px_2px_0_#000000] {windowStates.readme.maximized
						? 'top-0 left-0 right-0 bottom-0 w-full max-w-full'
						: 'top-6 left-4 sm:left-12 w-[92%] sm:w-[680px] max-w-[700px]'}"
					style="z-index: {windowZ.readme};"
					onclick={(e) => {
						e.stopPropagation();
						focusWindow('readme');
					}}
					role="presentation"
				>
					<Window
						title="README.txt - Notepad"
						icon="document"
						active={activeWindow === 'readme'}
						maximized={windowStates.readme.maximized}
						onclose={() => closeWindow('readme')}
						onminimize={() => toggleMinimize('readme')}
						onmaximize={() => toggleMaximize('readme')}
					>
						{#snippet menuBar()}
							<div class="flex gap-3 px-1 text-[12px]">
								<span class="cursor-pointer hover:win-selected px-1"><u>F</u>ile</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>E</u>dit</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>S</u>earch</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>H</u>elp</span>
							</div>
						{/snippet}

						<div class="p-4 space-y-3 win-prose bg-white min-h-[260px] overflow-y-auto max-h-[70vh]">
							<div class="border-b border-[#C0C0C0] pb-2">
								<h1
									class="font-bold text-[16px]"
									style="color: #000080; font-family: 'WIN95FA', 'MS Sans Serif', sans-serif; -webkit-font-smoothing: none;"
								>
									{PROFILE.name} ({PROFILE.alias})
								</h1>
								<div class="text-[13px] font-bold text-[#000000] mt-0.5">
									{PROFILE.roles.join(' // ')}
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-[#FFFFE1] border border-[#000000] text-[13px] win-sunken-sm">
								<div>
									<strong>Lahir / Birth:</strong> {PROFILE.birthPlace}, {PROFILE.birthDate} ({PROFILE.age} thn)
								</div>
								<div>
									<strong>Kampus:</strong>
									<a href={PROFILE.education.website} target="_blank" rel="external noopener noreferrer" class="text-[#0000FF] underline ml-1">
										ISTTS Surabaya
									</a>
								</div>
								<div class="sm:col-span-2">
									<strong>Status:</strong> {PROFILE.education.status}
								</div>
							</div>

							<p class="text-[15px] leading-relaxed">
								{lang === 'id' ? PROFILE.bio.id : PROFILE.bio.en}
							</p>

							<div class="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E5E5]">
								<Button onclick={() => openWindow('cv')} class="font-bold">
									<Icon name="briefcase" size={16} />
									<span class="ml-1.5">Download CV (PDF)</span>
								</Button>
								<Button onclick={() => openWindow('projects')}>
									<Icon name="projects" size={16} />
									<span class="ml-1.5">View Projects</span>
								</Button>
								<Button onclick={() => openWindow('contact')}>
									<Icon name="contact" size={16} />
									<span class="ml-1.5">Send Message</span>
								</Button>
								<Button onclick={() => window.open(PROFILE.whatsapp.link, '_blank', 'noopener')}>
									<Icon name="chat" size={16} color="#008000" />
									<span class="ml-1.5">WhatsApp</span>
								</Button>
							</div>

							<div
								class="text-[12px] pt-2 flex flex-wrap gap-3 border-t border-[#C0C0C0]"
								style="font-family: 'Cousine', monospace;"
							>
								<span>Email: <a href="mailto:{PROFILE.email}" rel="external" class="text-[#0000FF] underline">{PROFILE.email}</a></span>
								<span>GitHub: <a href={PROFILE.github.link} target="_blank" rel="external noopener noreferrer" class="text-[#0000FF] underline">github.com/{PROFILE.github.username}</a></span>
								<span>Instagram: <a href={PROFILE.instagram.link} target="_blank" rel="external noopener noreferrer" class="text-[#0000FF] underline">@{PROFILE.instagram.handle}</a></span>
							</div>
						</div>

						{#snippet statusBar()}
							<StatusBar text="Encoding: UTF-8 | Workstation Edition | Status: Ready" />
						{/snippet}
					</Window>
				</div>
			{/if}

			<!-- Window: Projects - Explorer (55% list, 45% preview) -->
			{#if windowStates.projects.open && !windowStates.projects.minimized}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div
					class="win98-window-frame absolute shadow-[2px_2px_0_#000000] {windowStates.projects.maximized
						? 'top-0 left-0 right-0 bottom-0 w-full max-w-full'
						: 'top-10 left-6 sm:left-20 w-[95%] sm:w-[860px] max-w-[880px]'}"
					style="z-index: {windowZ.projects};"
					onclick={(e) => {
						e.stopPropagation();
						focusWindow('projects');
					}}
					role="presentation"
				>
					<Window
						title="C:\Kantz\Projects"
						icon="projects"
						active={activeWindow === 'projects'}
						maximized={windowStates.projects.maximized}
						onclose={() => closeWindow('projects')}
						onminimize={() => toggleMinimize('projects')}
						onmaximize={() => toggleMaximize('projects')}
					>
						{#snippet menuBar()}
							<div class="flex gap-3 px-1 text-[12px]">
								<span class="cursor-pointer hover:win-selected px-1"><u>F</u>ile</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>E</u>dit</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>V</u>iew</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>H</u>elp</span>
							</div>
						{/snippet}

						{#snippet toolbar()}
							<div class="flex items-center gap-1 w-full flex-wrap sm:flex-nowrap">
								<Button variant="tool" onclick={() => {}} class="text-[11px] px-2 py-0.5">
									<Icon name="arrow-left" size={14} />
									<span class="ml-1 hidden sm:inline">Back</span>
								</Button>
								<Button variant="tool" onclick={() => {}} class="text-[11px] px-2 py-0.5">
									<Icon name="arrow-right" size={14} />
									<span class="ml-1 hidden sm:inline">Forward</span>
								</Button>

								<div class="win-etched w-[1px] h-5 mx-1"></div>

								<Button
									variant={projectView === 'details' ? 'pressed' : 'tool'}
									onclick={() => (projectView = 'details')}
									class="text-[11px] px-2 py-0.5"
									title="Details view"
								>
									<Icon name="file" size={14} />
									<span class="ml-1">Details</span>
								</Button>
								<Button
									variant={projectView === 'icons' ? 'pressed' : 'tool'}
									onclick={() => (projectView = 'icons')}
									class="text-[11px] px-2 py-0.5"
									title="Large Icons view"
								>
									<Icon name="folder" size={14} />
									<span class="ml-1">Icons</span>
								</Button>

								<div class="win-etched w-[1px] h-5 mx-1"></div>

								<span class="text-[12px] shrink-0 font-bold" style="color: #000000;">Address:</span>
								<div
									class="win-sunken-field px-2 py-1 flex-1 text-[12px] truncate"
									style="font-family: 'Cousine', monospace;"
								>
									{explorerAddress}
								</div>
							</div>
						{/snippet}

						<div class="flex flex-col md:flex-row min-h-[320px] max-h-[500px]">
							<!-- Left Pane: 55% List/Table -->
							<div class="flex-1 overflow-auto bg-white min-w-0 md:basis-[55%] border-b md:border-b-0 md:border-r border-[#808080]">
								{#if projectView === 'details'}
									<table class="w-full text-left border-collapse" style="font-size: 12px;">
										<thead>
											<tr style="background: #C0C0C0;">
												<th class="win-raised-sm px-2.5 py-1 font-bold">Name</th>
												<th class="win-raised-sm px-2.5 py-1 font-bold hidden sm:table-cell">Type</th>
												<th class="win-raised-sm px-2.5 py-1 font-bold hidden md:table-cell">Stack</th>
												<th class="win-raised-sm px-2.5 py-1 font-bold">Link</th>
											</tr>
										</thead>
										<tbody>
											{#each data.projects as project (project.id)}
												<tr
													class="border-b group cursor-pointer"
													style="border-color: #E5E5E5;"
													class:win-selected={selectedProjectId === project.id}
													onclick={() =>
														(selectedProjectId =
															project.id === selectedProjectId ? null : project.id)}
												>
													<td class="px-2.5 py-2">
														<div class="flex items-center gap-2">
															<Icon name="folder" size={18} color="#D97706" />
															<span class="font-medium truncate max-w-[150px]">{project.title}</span>
														</div>
													</td>
													<td class="px-2.5 py-2 hidden sm:table-cell" style="color: #595959;">
														{project.category}
													</td>
													<td
														class="px-2.5 py-2 hidden md:table-cell truncate max-w-[130px]"
														style="font-family: 'Cousine', monospace; font-size: 11px; color: #595959;"
													>
														{Array.isArray(project.technologies)
															? (project.technologies as string[]).slice(0, 3).join(', ')
															: ''}
													</td>
													<td class="px-2.5 py-2">
														{#if project.liveUrl}
															<a
																href={project.liveUrl}
																target="_blank"
																rel="external noopener noreferrer"
																style="color: #0000FF; text-decoration: underline;"
																onclick={(e) => e.stopPropagation()}
															>
																Launch
															</a>
														{:else}
															<span style="color: #595959;">Local</span>
														{/if}
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								{:else}
									<div class="flex flex-wrap gap-4 p-4">
										{#each data.projects as project (project.id)}
											<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
											<div
												class="flex flex-col items-center w-[80px] cursor-pointer"
												onclick={() =>
													(selectedProjectId =
														project.id === selectedProjectId ? null : project.id)}
											>
												<Icon name="folder" size={36} color="#D97706" desktopShadow={true} />
												<span
													class="text-[12px] text-center mt-1 leading-tight break-words max-w-[80px] px-0.5"
													class:win-selected={selectedProjectId === project.id}
												>
													{project.title}
												</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Right Pane: 45% Web View Preview & Rendered Markdown Case Study -->
							<div class="md:basis-[45%] shrink-0 win-sunken overflow-y-auto p-3.5 bg-white space-y-3">
								{#if selectedProject}
									<div class="flex items-center gap-2 border-b border-[#C0C0C0] pb-2">
										<Icon name="folder" size={24} color="#D97706" />
										<strong class="text-[13px] truncate text-[#000080]">{selectedProject.title}</strong>
									</div>

									<!-- Project Thumbnail Preview -->
									<div class="win-sunken-field p-2 bg-[#F8F8F8] flex flex-col items-center justify-center min-h-[100px] border border-[#808080]">
										{#if selectedProject.thumbnailUrl}
											<img
												src={selectedProject.thumbnailUrl}
												alt={selectedProject.title}
												class="max-h-[140px] w-auto object-contain border border-[#C0C0C0]"
											/>
										{:else}
											<div class="text-center p-3 space-y-1">
												<Icon name="projects" size={32} color="#000080" />
												<div class="text-[11px] font-bold text-[#595959]">Web View Preview</div>
												<div class="text-[10px] text-[#808080]">{selectedProject.category} // Live System</div>
											</div>
										{/if}
									</div>

									<!-- Rendered Markdown Case Study -->
									<div class="win-prose text-[13px] leading-relaxed">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html renderMarkdown(selectedProject.description ?? '')}
									</div>

									{#if selectedProject.category}
										<div class="text-[12px]">
											<strong>Type:</strong> <span class="text-[#000000]">{selectedProject.category}</span>
										</div>
									{/if}

									{#if Array.isArray(selectedProject.technologies) && (selectedProject.technologies as string[]).length > 0}
										<div class="space-y-1">
											<strong class="text-[12px]">Stack:</strong>
											<div
												class="text-[11px] p-1.5 win-sunken-field bg-[#F5F5F5]"
												style="font-family: 'Cousine', monospace; color: #000080;"
											>
												{(selectedProject.technologies as string[]).join(', ')}
											</div>
										</div>
									{/if}

									<div class="pt-2 flex flex-wrap gap-2 border-t border-[#C0C0C0]">
										{#if selectedProject.liveUrl}
											<Button
												onclick={() => window.open(selectedProject.liveUrl!, '_blank', 'noopener')}
												class="font-bold"
											>
												<Icon name="external" size={14} />
												<span class="ml-1 text-[12px]">Launch Project</span>
											</Button>
										{/if}
										{#if selectedProject.githubUrl}
											<Button
												onclick={() => window.open(selectedProject.githubUrl!, '_blank', 'noopener')}
											>
												<Icon name="github" size={14} />
												<span class="ml-1 text-[12px]">Source Code</span>
											</Button>
										{/if}
									</div>
								{:else}
									<div class="text-center py-12 text-[#595959] space-y-2">
										<Icon name="info" size={32} color="#808080" />
										<p class="text-[13px]">Select a project from the left panel to read case study and preview details.</p>
									</div>
								{/if}
							</div>
						</div>

						{#snippet statusBar()}
							<StatusBar
								text="{data.projects.length} object(s) | {data.featuredProjects.length} featured tier | Explorer v4.0"
							/>
						{/snippet}
					</Window>
				</div>
			{/if}

			<!-- Window: System Properties - Device Manager (Skills) -->
			{#if windowStates.skills.open && !windowStates.skills.minimized}
				<div
					class="win98-window-frame absolute shadow-[2px_2px_0_#000000] {windowStates.skills.maximized
						? 'top-0 left-0 right-0 bottom-0 w-full max-w-full'
						: 'top-16 left-8 sm:left-28 w-[92%] sm:w-[560px] max-w-[580px]'}"
					style="z-index: {windowZ.skills};"
					onclick={(e) => {
						e.stopPropagation();
						focusWindow('skills');
					}}
					role="presentation"
				>
					<Window
						title="System Properties"
						icon="skills"
						active={activeWindow === 'skills'}
						maximized={windowStates.skills.maximized}
						onclose={() => closeWindow('skills')}
						onminimize={() => toggleMinimize('skills')}
						onmaximize={() => toggleMaximize('skills')}
					>
						<div class="p-3 space-y-3" style="background: #C0C0C0;">
							<div class="flex items-center gap-0.5" style="border-bottom: 1px solid #808080;">
								<span
									class="win-raised px-3 py-1 font-bold text-[12px] bg-white"
									style="border-bottom: 1px solid white;"
								>
									Device Manager
								</span>
								<span class="win-raised-sm px-3 py-1 text-[12px]" style="color: #808080; text-shadow: 1px 1px 0 #FFFFFF;">
									Performance
								</span>
								<span class="win-raised-sm px-3 py-1 text-[12px]" style="color: #808080; text-shadow: 1px 1px 0 #FFFFFF;">
									General
								</span>
							</div>

							<div class="text-[12px] text-black">
								View hardware subsystems and engineering proficiencies registered on this workstation:
							</div>

							<TreeView
								nodes={[
									{
										id: 'root',
										label: 'KANTZ-WORKSTATION-SE',
										icon: 'folder',
										iconColor: '#C0C0C0',
										children: skillTree
									}
								]}
								class="min-h-[220px] max-h-[320px]"
							/>

							<div class="flex justify-end gap-2 pt-1">
								<Button onclick={() => closeWindow('skills')} class="min-w-[80px]">OK</Button>
								<Button onclick={() => closeWindow('skills')} class="min-w-[80px]">Cancel</Button>
							</div>
						</div>
					</Window>
				</div>
			{/if}

			<!-- Window: Experiences - HTML Help -->
			{#if windowStates.experiences.open && !windowStates.experiences.minimized}
				<div
					class="win98-window-frame absolute shadow-[2px_2px_0_#000000] {windowStates.experiences.maximized
						? 'top-0 left-0 right-0 bottom-0 w-full max-w-full'
						: 'top-12 left-6 sm:left-16 w-[95%] sm:w-[740px] max-w-[760px]'}"
					style="z-index: {windowZ.experiences};"
					onclick={(e) => {
						e.stopPropagation();
						focusWindow('experiences');
					}}
					role="presentation"
				>
					<Window
						title="Experiences - HTML Help"
						icon="experience"
						active={activeWindow === 'experiences'}
						maximized={windowStates.experiences.maximized}
						onclose={() => closeWindow('experiences')}
						onminimize={() => toggleMinimize('experiences')}
						onmaximize={() => toggleMaximize('experiences')}
					>
						{#snippet toolbar()}
							<div class="flex items-center gap-1">
								<Button variant="tool" onclick={() => {}} class="text-[11px] px-2 py-0.5">
									<Icon name="arrow-left" size={14} />
								</Button>
								<Button variant="tool" onclick={() => {}} class="text-[11px] px-2 py-0.5">
									<Icon name="arrow-right" size={14} />
								</Button>
								<div class="win-etched w-[1px] h-5 mx-1"></div>
								<span class="text-[12px] font-bold" style="color: #000000;">Contents | Index | Search</span>
							</div>
						{/snippet}

						<HtmlHelp
							title="Work Experiences"
							tocItems={expToc}
							selectedId={selectedExpId}
							onselect={(id) => (selectedExpId = id)}
							class="min-h-[300px] max-h-[440px]"
						>
							{#if selectedExp}
								<div class="space-y-3">
									<h2
										class="font-bold text-[16px] border-b pb-1 text-[#000080]"
										style="border-color: #C0C0C0; font-family: 'WIN95FA', sans-serif; -webkit-font-smoothing: none;"
									>
										{selectedExp.role}
									</h2>
									<div class="text-[13px] font-bold text-[#000000]">
										{selectedExp.company}
										{#if selectedExp.period}
											&nbsp;|&nbsp;
											<span style="color: #595959;">
												{selectedExp.period}
											</span>
										{/if}
									</div>
									{#if selectedExp.description}
										<p class="text-[15px] leading-relaxed">{selectedExp.description}</p>
									{/if}
									{#if selectedExp.highlights && (selectedExp.highlights as string[]).length > 0}
										<div class="mt-2">
											<strong class="text-[13px]">Key Deliverables:</strong>
											<ul class="space-y-1.5 mt-1.5 text-[14px]">
												{#each selectedExp.highlights as h, idx (idx)}
													<li class="flex items-start gap-2">
														<span style="color: #000080; font-weight: bold; shrink-0: true;">-</span>
														<span>{h}</span>
													</li>
												{/each}
											</ul>
										</div>
									{/if}
								</div>
							{:else}
								<p class="text-[14px]" style="color: #595959;">
									Select a company from the contents panel to view work history.
								</p>
							{/if}
						</HtmlHelp>

						{#snippet statusBar()}
							<StatusBar text="{data.experiences.length} positions registered | HTML Help v1.2" />
						{/snippet}
					</Window>
				</div>
			{/if}

			<!-- Window: Contact - New Message (Outlook Express style) -->
			{#if windowStates.contact.open && !windowStates.contact.minimized}
				<div
					class="win98-window-frame absolute shadow-[2px_2px_0_#000000] {windowStates.contact.maximized
						? 'top-0 left-0 right-0 bottom-0 w-full max-w-full'
						: 'top-14 left-4 sm:left-24 w-[92%] sm:w-[580px] max-w-[600px]'}"
					style="z-index: {windowZ.contact};"
					onclick={(e) => {
						e.stopPropagation();
						focusWindow('contact');
					}}
					role="presentation"
				>
					<Window
						title="New Message"
						icon="contact"
						active={activeWindow === 'contact'}
						maximized={windowStates.contact.maximized}
						onclose={() => closeWindow('contact')}
						onminimize={() => toggleMinimize('contact')}
						onmaximize={() => toggleMaximize('contact')}
					>
						{#snippet menuBar()}
							<div class="flex gap-3 px-1 text-[12px]">
								<span class="cursor-pointer hover:win-selected px-1"><u>F</u>ile</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>E</u>dit</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>V</u>iew</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>I</u>nsert</span>
								<span class="cursor-pointer hover:win-selected px-1"><u>H</u>elp</span>
							</div>
						{/snippet}

						{#snippet toolbar()}
							<div class="flex items-center gap-1 flex-wrap">
								<Button
									variant="tool"
									onclick={() => {
										const form = document.getElementById('contact-form') as HTMLFormElement;
										form?.requestSubmit();
									}}
									class="text-[11px] px-2.5 py-0.5 font-bold"
								>
									<Icon name="mail" size={14} />
									<span class="ml-1">Send</span>
								</Button>
								<div class="win-etched w-[1px] h-5 mx-1"></div>
								<Button
									variant="tool"
									onclick={() => window.open(PROFILE.whatsapp.link, '_blank', 'noopener')}
									class="text-[11px] px-2.5 py-0.5 font-bold"
								>
									<Icon name="chat" size={14} color="#008000" />
									<span class="ml-1">WhatsApp</span>
								</Button>
								<Button
									variant="tool"
									onclick={() => (window.location.href = `mailto:${PROFILE.email}`)}
									class="text-[11px] px-2.5 py-0.5"
								>
									<Icon name="mail" size={14} />
									<span class="ml-1">Email Client</span>
								</Button>
								<Button variant="tool" onclick={() => openWindow('cv')} class="text-[11px] px-2.5 py-0.5">
									<Icon name="briefcase" size={14} />
									<span class="ml-1">Download CV</span>
								</Button>
							</div>
						{/snippet}

						<div class="p-3 space-y-2.5 bg-[#C0C0C0]">
							<div class="win-sunken-field p-2 space-y-1.5 text-[12px]" style="background: #FFFFFF;">
								<div class="flex items-center gap-2 border-b pb-1" style="border-color: #C0C0C0;">
									<span class="w-12 shrink-0 font-bold">To:</span>
									<span class="font-bold text-[#000080]">{PROFILE.name} &lt;{PROFILE.email}&gt;</span>
								</div>
								<div class="flex items-center gap-2 border-b pb-1" style="border-color: #C0C0C0;">
									<span class="w-12 shrink-0 font-bold">WhatsApp:</span>
									<a
										href={PROFILE.whatsapp.link}
										target="_blank"
										rel="external noopener noreferrer"
										style="color: #0000FF; text-decoration: underline;"
									>
										{PROFILE.whatsapp.display}
									</a>
								</div>
								<div class="flex items-center gap-2 border-b pb-1" style="border-color: #C0C0C0;">
									<span class="w-12 shrink-0 font-bold">GitHub:</span>
									<a
										href={PROFILE.github.link}
										target="_blank"
										rel="external noopener noreferrer"
										style="color: #0000FF; text-decoration: underline;"
									>
										github.com/{PROFILE.github.username}
									</a>
								</div>
							</div>

							{#if contactSent}
								<div
									class="p-4 text-[13px] text-center bg-[#FFFFE1] border border-[#808080]"
								>
									<strong>Message dispatched.</strong> I will get back to you shortly.
								</div>
							{:else}
								<form
									id="contact-form"
									action="?/contact"
									method="POST"
									use:enhance={() => {
										contactSending = true;
										return async ({ result }) => {
											contactSending = false;
											if (result.type === 'success') {
												contactSent = true;
												contactFeedback = {
													type: 'info',
													title: 'Message Sent',
													message: 'Your message has been dispatched successfully. Kantz will get back to you shortly.'
												};
												contactFeedbackDialog = true;
											} else if (result.type === 'failure') {
												contactFeedback = {
													type: 'error',
													title: 'Delivery Failed',
													message:
														(result.data?.message as string) ||
														'Could not send message. Please verify your input.'
												};
												contactFeedbackDialog = true;
											}
										};
									}}
									class="space-y-2.5"
								>
									<input
										type="text"
										name="website"
										bind:value={contactHoneypot}
										autocomplete="off"
										tabindex="-1"
										style="position: absolute; left: -9999px; opacity: 0;"
										aria-hidden="true"
									/>

									<div class="flex flex-col gap-1">
										<label for="contact-name" class="text-[12px] font-bold">From (Name):</label>
										<input
											id="contact-name"
											name="name"
											type="text"
											bind:value={contactName}
											required
											autocomplete="name"
											class="win-sunken-field px-2.5 py-1 text-[12px] w-full"
											placeholder="Your full name"
										/>
									</div>

									<div class="flex flex-col gap-1">
										<label for="contact-email" class="text-[12px] font-bold">Reply-To (Email):</label>
										<input
											id="contact-email"
											name="email"
											type="email"
											bind:value={contactEmail}
											required
											autocomplete="email"
											class="win-sunken-field px-2.5 py-1 text-[12px] w-full"
											placeholder="your@email.com"
										/>
									</div>

									<div class="flex flex-col gap-1">
										<label for="contact-message" class="text-[12px] font-bold">Message:</label>
										<textarea
											id="contact-message"
											name="message"
											bind:value={contactMessage}
											required
											rows="5"
											class="win-sunken-field px-2.5 py-1 text-[12px] w-full resize-y win-prose"
											style="font-family: 'Cousine', monospace; font-size: 12px;"
											placeholder="Write your message here..."
										></textarea>
									</div>

									<div class="flex justify-end gap-2 pt-1">
										<Button
											type="submit"
											disabled={contactSending}
											class="min-w-[90px] font-bold"
										>
											{contactSending ? 'Sending...' : 'Send Message'}
										</Button>
										<Button onclick={() => closeWindow('contact')} class="min-w-[80px]">
											Cancel
										</Button>
									</div>
								</form>
							{/if}
						</div>

						{#snippet statusBar()}
							<StatusBar text="New Message | Outbox | To: {PROFILE.email}" />
						{/snippet}
					</Window>
				</div>
			{/if}

			<!-- Window: Display Properties (Settings) -->
			{#if windowStates.settings.open && !windowStates.settings.minimized}
				<div
					class="win98-window-frame absolute shadow-[2px_2px_0_#000000] {windowStates.settings.maximized
						? 'top-0 left-0 right-0 bottom-0 w-full max-w-full'
						: 'top-14 left-8 sm:left-32 w-[90%] sm:w-[500px] max-w-[520px]'}"
					style="z-index: {windowZ.settings};"
					onclick={(e) => {
						e.stopPropagation();
						focusWindow('settings');
					}}
					role="presentation"
				>
					<Window
						title="Display Properties"
						icon="settings"
						active={activeWindow === 'settings'}
						maximized={windowStates.settings.maximized}
						onclose={() => closeWindow('settings')}
						onminimize={() => toggleMinimize('settings')}
						onmaximize={() => toggleMaximize('settings')}
					>
						<div class="p-3 space-y-3 bg-[#C0C0C0]">
							<!-- Tabs Header -->
							<div class="flex items-center gap-0.5 border-b border-[#808080]">
								<button
									type="button"
									onclick={() => (settingsTab = 'appearance')}
									class="px-3 py-1 font-bold text-[12px] {settingsTab === 'appearance'
										? 'win-raised bg-white border-b-white'
										: 'win-raised-sm text-[#000000]'}"
								>
									Appearance
								</button>
								<button
									type="button"
									onclick={() => (settingsTab = 'language')}
									class="px-3 py-1 font-bold text-[12px] {settingsTab === 'language'
										? 'win-raised bg-white border-b-white'
										: 'win-raised-sm text-[#000000]'}"
								>
									Language
								</button>
								<button
									type="button"
									onclick={() => (settingsTab = 'effects')}
									class="px-3 py-1 font-bold text-[12px] {settingsTab === 'effects'
										? 'win-raised bg-white border-b-white'
										: 'win-raised-sm text-[#000000]'}"
								>
									Effects &amp; Motion
								</button>
							</div>

							<!-- Tab 1: Appearance (Theme) -->
							{#if settingsTab === 'appearance'}
								<div class="space-y-3 p-2 bg-[#C0C0C0]">
									<div class="font-bold text-[12px]">Desktop Wallpaper Theme:</div>
									<div class="space-y-2 win-sunken p-3 bg-white text-[13px]">
										<label class="flex items-center gap-2.5 cursor-pointer">
											<input
												type="radio"
												name="theme_opt"
												value="dark-teal"
												checked={wallpaperTheme === 'dark-teal'}
												onchange={() => (wallpaperTheme = 'dark-teal')}
											/>
											<span class="font-bold">Dark Teal (Authentic Kantz OS Default)</span>
										</label>
										<label class="flex items-center gap-2.5 cursor-pointer">
											<input
												type="radio"
												name="theme_opt"
												value="deep-slate"
												checked={wallpaperTheme === 'deep-slate'}
												onchange={() => (wallpaperTheme = 'deep-slate')}
											/>
											<span class="font-bold">Deep Slate (Midnight Workstation Edition)</span>
										</label>
									</div>
								</div>
							{/if}

							<!-- Tab 2: Language -->
							{#if settingsTab === 'language'}
								<div class="space-y-3 p-2 bg-[#C0C0C0]">
									<div class="font-bold text-[12px]">Interface Language:</div>
									<div class="space-y-2 win-sunken p-3 bg-white text-[13px]">
										<label class="flex items-center gap-2.5 cursor-pointer">
											<input
												type="radio"
												name="lang_opt"
												value="en"
												checked={lang === 'en'}
												onchange={() => (lang = 'en')}
											/>
											<span>English (International standard)</span>
										</label>
										<label class="flex items-center gap-2.5 cursor-pointer">
											<input
												type="radio"
												name="lang_opt"
												value="id"
												checked={lang === 'id'}
												onchange={() => (lang = 'id')}
											/>
											<span>Bahasa Indonesia</span>
										</label>
									</div>
								</div>
							{/if}

							<!-- Tab 3: Effects & Motion -->
							{#if settingsTab === 'effects'}
								<div class="space-y-3 p-2 bg-[#C0C0C0]">
									<div class="font-bold text-[12px]">Accessibility &amp; Animation:</div>
									<div class="space-y-2 win-sunken p-3 bg-white text-[13px]">
										<label class="flex items-center gap-2.5 cursor-pointer">
											<input
												type="checkbox"
												checked={reducedMotion}
												onchange={(e) => (reducedMotion = e.currentTarget.checked)}
											/>
											<span>Fast Mode (Reduce motion &amp; bypass boot splash)</span>
										</label>
									</div>
								</div>
							{/if}

							<div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
								<Button onclick={() => closeWindow('settings')} class="min-w-[80px]">OK</Button>
								<Button onclick={() => closeWindow('settings')} class="min-w-[80px]">Cancel</Button>
							</div>
						</div>
					</Window>
				</div>
			{/if}
		</div>

		<!-- Channel Bar Drawer Toggle Button (Edge of Screen) -->
		<div class="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-30">
			<button
				type="button"
				onclick={() => (channelDrawerOpen = !channelDrawerOpen)}
				class="win-raised px-1 py-3 text-[11px] font-bold [writing-mode:vertical-rl] select-none cursor-pointer flex items-center gap-1 active:win-pressed"
				title={channelDrawerOpen ? 'Collapse Channel Bar' : 'Expand Channel Bar'}
			>
				<span>Channels</span>
				<span>{channelDrawerOpen ? '&gt;' : '&lt;'}</span>
			</button>
		</div>

		<!-- Channel Bar (Active Desktop Drawer, right side) -->
		{#if channelDrawerOpen}
			<div class="hidden md:flex shrink-0 h-full border-l transition-all duration-200" style="border-color: #808080;">
				<ChannelBar
					items={channelItems}
					ondismiss={() => (channelDrawerOpen = false)}
				/>
			</div>
		{/if}
	</div>

	<!-- CV Download Dialog -->
	<Dialog
		open={cvDialogOpen}
		title="Download Curriculum Vitae"
		type="question"
		confirmText="Download"
		cancelText="Cancel"
		onconfirm={() => {
			cvDialogOpen = false;
			const url = cvLang === 'id' ? '/cv/cv-kantz-id.pdf' : '/cv/cv-kantz-en.pdf';
			window.open(url, '_blank');
		}}
		oncancel={() => (cvDialogOpen = false)}
	>
		<p class="font-bold mb-2 text-[12px]">Select CV version to download:</p>
		<div class="space-y-2 text-[12px]">
			<label class="flex items-center gap-2.5 cursor-pointer">
				<input
					type="radio"
					name="cv_lang"
					value="en"
					checked={cvLang === 'en'}
					onchange={() => (cvLang = 'en')}
				/>
				<span>English (International / Tech standard)</span>
			</label>
			<label class="flex items-center gap-2.5 cursor-pointer">
				<input
					type="radio"
					name="cv_lang"
					value="id"
					checked={cvLang === 'id'}
					onchange={() => (cvLang = 'id')}
				/>
				<span>Indonesian (Bahasa Indonesia)</span>
			</label>
		</div>
	</Dialog>

	<!-- Contact Feedback Dialog -->
	<Dialog
		open={contactFeedbackDialog}
		title={contactFeedback.title}
		type={contactFeedback.type}
		confirmText="OK"
		onconfirm={() => (contactFeedbackDialog = false)}
		oncancel={() => (contactFeedbackDialog = false)}
		message={contactFeedback.message}
	/>

	<!-- Shut Down System Dialog -->
	<Dialog
		open={shutdownDialogOpen}
		title="Shut Down System"
		type="warning"
		confirmText="OK"
		cancelText="Cancel"
		onconfirm={handleShutdownConfirm}
		oncancel={() => (shutdownDialogOpen = false)}
	>
		<p class="font-bold mb-2.5 text-[12px]">What do you want the computer to do?</p>
		<div class="space-y-2 text-[12px]">
			<label class="flex items-center gap-2.5 cursor-pointer">
				<input
					type="radio"
					name="shutdown_opt"
					value="shutdown"
					checked={shutdownSelected === 'shutdown'}
					onchange={() => (shutdownSelected = 'shutdown')}
				/>
				<span>Shut down workstation</span>
			</label>
			<label class="flex items-center gap-2.5 cursor-pointer">
				<input
					type="radio"
					name="shutdown_opt"
					value="restart"
					checked={shutdownSelected === 'restart'}
					onchange={() => (shutdownSelected = 'restart')}
				/>
				<span>Restart system</span>
			</label>
			<label class="flex items-center gap-2.5 cursor-pointer">
				<input
					type="radio"
					name="shutdown_opt"
					value="dos"
					checked={shutdownSelected === 'dos'}
					onchange={() => (shutdownSelected = 'dos')}
				/>
				<span>Restart in MS-DOS mode</span>
			</label>
		</div>
	</Dialog>

	<!-- Bottom Taskbar -->
	<Taskbar
		tasks={taskList}
		{lang}
		onstartitem={(id) => openWindow(id)}
		ontaskclick={(id) => {
			const wid = id as WinId;
			if (activeWindow === wid && !windowStates[wid]?.minimized) {
				toggleMinimize(wid);
			} else {
				focusWindow(wid);
			}
		}}
		ontogglelang={toggleLanguage}
	/>
</main>

<style>
	/* Responsive: mobile single window maximized */
	@media (max-width: 767px) {
		:global(.win98-window-frame) {
			position: fixed !important;
			top: 0 !important;
			left: 0 !important;
			right: 0 !important;
			bottom: 34px !important;
			width: 100% !important;
			max-width: 100% !important;
			z-index: 30 !important;
		}
	}

	/* Coarse pointer: larger hit areas */
	@media (pointer: coarse) {
		:global([data-ui='win98'] button) {
			min-height: 34px;
		}
	}
</style>
