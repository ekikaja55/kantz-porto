import type { Project } from './db/schema';

export const initialProjects: Project[] = [
	{
		id: 'proj-mlbb-voice-timer',
		slug: 'mlbb-voice-timer',
		title: 'MLBB Voice Timer (Second Device Audio HUD)',
		tagline: 'High-precision, voice-controlled enemy battle spell cooldown tracker with zero-ban risk.',
		description: `### Overview
MLBB Voice Timer is a voice-controlled audio HUD designed to give competitive Mobile Legends: Bang Bang players tactical cooldown tracking without software tampering.

### Physical Anti-Cheat Isolation Architecture
Unlike dangerous on-device overlays, MLBB Voice Timer operates under 100% physical hardware isolation:
- Runs entirely on a secondary device (laptop, tablet, or external monitor).
- Zero software interaction with the primary mobile gaming device (no ADB, no local WebSockets, no screen scraping, no memory reading).
- 100% immune to Moonton Anti-Cheat Engine (ACE) penalties.

### Key Engineering Highlights
- **Multi-Entity Burst Speech NLP Engine:** Tracks up to 5 enemy spells called out in rapid succession during intense teamfights without pausing.
- **Web Workers & High-Precision Audio Synthesizer:** Countdown loops execute in background Web Workers to guarantee millisecond accuracy even when tabs are throttled.
- **Built with Svelte 5:** Utilizes modern Runes for reactive timer states and zero-latency HUD rendering.`,
		category: 'web',
		tier: 1,
		status: 'live',
		images: [],
		technologies: ['Svelte 5', 'SvelteKit SPA', 'Tailwind CSS v4', 'Web Audio API', 'Web Workers'],
		liveUrl: 'https://voice-timer-project.vercel.app',
		githubUrl: 'https://github.com/ekikaja55/voice-timer-project',
		thumbnailUrl: null,
		orderIndex: 1,
		isPublished: true,
		createdAt: new Date('2026-11-01'),
		updatedAt: new Date('2026-11-08')
	},
	{
		id: 'proj-invoizy',
		slug: 'invoizy',
		title: 'Invoizy (Cho Lazey Studio)',
		tagline: 'Automated order-to-invoice SaaS with automatic PDF generation and email dispatch.',
		description: `### Overview
Invoizy is an end-to-end commerce automation tool designed for boutique merchandise stores. Rebuilt from a legacy Google Form + Apps Script system into a standalone modern SvelteKit web application.

### Key Workflows
- **Public Buyer Order Portal:** Real-time merchandise selector with drag-and-drop ordering and dynamic subtotal calculations.
- **Serverless PDF Engine:** Automatically compiles branded PDF invoices on the fly.
- **Automated Email Dispatch:** Sends immediate payment receipts and tracking links via transactional mail providers.
- **Admin Management Dashboard:** Real-time catalog management, stock toggling, and payment verification.

### Production Provenance
Successfully deployed and battle-tested during creative conventions (ChibiconXI C4), handling high-traffic batch ordering.`,
		category: 'web',
		tier: 1,
		status: 'live',
		images: [],
		technologies: ['Svelte 5', 'SvelteKit', 'Supabase', 'Tailwind CSS', 'PostgreSQL', 'svelte-dnd'],
		liveUrl: 'https://cho-lazey-studio.vercel.app',
		githubUrl: 'https://github.com/ekikaja55/cholazey',
		thumbnailUrl: null,
		orderIndex: 2,
		isPublished: true,
		createdAt: new Date('2026-09-01'),
		updatedAt: new Date('2026-11-17')
	},
	{
		id: 'proj-craftique-id',
		slug: 'craftique-id',
		title: 'Craftique-ID',
		tagline: 'Modular artist showcase and commission marketplace with customizable page layouts.',
		description: `### Overview
Craftique-ID bridges artists and collectors. Each creator receives a dedicated storefront (/artist/[slug]) composed of modular customizable sections.

### Architectural Features
- **Dynamic 9-Section Page Builder:** Artists can re-order, toggle, and restyle Hero, Gallery, Shop, Commission Rates, Testimonials, FAQ, and Contact sections.
- **Headless UI Primitives:** Built using bits-ui for strict accessibility compliance and custom styling flexibility.
- **Integrated Commission Pipeline:** Direct workflow for booking, milestone tracking, and payment verification.`,
		category: 'web',
		tier: 1,
		status: 'in_progress',
		images: [],
		technologies: ['Svelte 5', 'SvelteKit', 'bits-ui', 'Supabase', 'Tailwind CSS'],
		liveUrl: null,
		githubUrl: 'https://github.com/ekikaja55/craftique-id',
		thumbnailUrl: null,
		orderIndex: 3,
		isPublished: true,
		createdAt: new Date('2026-08-15'),
		updatedAt: new Date('2026-09-07')
	},
	{
		id: 'proj-tutur-id',
		slug: 'tutur-id',
		title: 'Tutur.id (BISINDO Sign Language Detector)',
		tagline: 'Real-time on-device Indonesian sign language recognition using computer vision.',
		description: `### Overview
Tutur.id is a cross-platform accessibility mobile application designed to bridge communication barriers for the deaf community by recognizing Indonesian Sign Language (BISINDO) alphabets in real-time.

### Technical Implementation
- **On-Device Inference:** TensorFlow Lite model runs entirely on-device with zero cloud latency and full offline support.
- **Camera Pipeline:** Real-time frame processing with front and rear camera toggles.
- **Visual Tracking Guide:** Real-time bounding guide and hand keypoint visualizer providing immediate user feedback.
- **Top-3 Confidence Metric:** Displays primary prediction alongside alternative confidence percentages to minimize ambiguity.`,
		category: 'mobile',
		tier: 1,
		status: 'in_progress',
		images: [],
		technologies: ['Flutter', 'Dart', 'TensorFlow Lite', 'Camera API', 'Riverpod'],
		liveUrl: null,
		githubUrl: 'https://github.com/ekikaja55/tutur_id_app',
		thumbnailUrl: null,
		orderIndex: 4,
		isPublished: true,
		createdAt: new Date('2026-02-01'),
		updatedAt: new Date('2026-02-12')
	},
	{
		id: 'proj-belajar-aksara',
		slug: 'belajar-aksara',
		title: 'Belajar Aksara (Aksara Bali)',
		tagline: '2D educational game for preserving and mastering traditional Balinese script.',
		description: `### Overview
An interactive 2D educational game built in Unity to facilitate modern interactive learning of the Balinese script (Aksara Bali).

### Technical Details
- Developed in Unity with clean C# object-oriented architecture.
- Interactive stroke and recognition quizzes.
- Packaged and released as a standalone Windows binary (v1.0.0).`,
		category: 'game',
		tier: 2,
		status: 'live',
		images: [],
		technologies: ['Unity 2D', 'C#', 'Game Design', 'Audio Integration'],
		liveUrl: 'https://github.com/ekikaja55/belajar_aksara/releases',
		githubUrl: 'https://github.com/ekikaja55/belajar_aksara',
		thumbnailUrl: null,
		orderIndex: 5,
		isPublished: true,
		createdAt: new Date('2026-07-01'),
		updatedAt: new Date('2026-08-25')
	},
	{
		id: 'proj-mathquest-pygame',
		slug: 'mathquest-pygame',
		title: 'MathQuest Logic Engine',
		tagline: 'Modular 2D educational game engine built in pure Python using the State Pattern.',
		description: `### Overview
A modular 2D educational game engine built from scratch in pure Python with Pygame, demonstrating clean Computer Science fundamentals without high-level engine abstractions.

### Architecture Highlights
- **State Pattern Scene Transitions:** Decoupled scene management handling Main Menu, Gameplay loop, Level-up intermission, and Game Over states.
- **Custom Event & Sprite System:** Custom-built lightweight Button sprites supporting hover and click dispatchers.
- **Dynamic Math Engine:** Procedural arithmetic challenge generation with scaling difficulty.
- **Persistence:** Robust JSON save system with fallback high-score tracking.`,
		category: 'systems',
		tier: 2,
		status: 'archived',
		images: [],
		technologies: ['Python', 'Pygame', 'State Pattern', 'Clean OOP'],
		liveUrl: null,
		githubUrl: 'https://github.com/ekikaja55/math_quest_pygame',
		thumbnailUrl: null,
		orderIndex: 6,
		isPublished: true,
		createdAt: new Date('2026-08-01'),
		updatedAt: new Date('2026-08-25')
	},
	{
		id: 'proj-whatsback-web',
		slug: 'whatsback-web',
		title: 'Whatsback Web Provider',
		tagline: 'Lightweight WhatsApp Web automation provider API and command dispatcher.',
		description: `### Overview
A backend automation provider interfacing with WhatsApp Web to execute predefined static commands, monitor message events, and manage contact directories.

### Architecture Highlights
- Express.js architecture with rate limiting and queue management.
- Headless browser session persistence.
- Built-in command router for automated responses.`,
		category: 'tool',
		tier: 2,
		status: 'archived',
		images: [],
		technologies: ['Node.js', 'Express', 'whatsapp-web.js', 'Tailwind CSS'],
		liveUrl: null,
		githubUrl: 'https://github.com/ekikaja55/whatsback-web',
		thumbnailUrl: null,
		orderIndex: 7,
		isPublished: true,
		createdAt: new Date('2025-08-01'),
		updatedAt: new Date('2025-08-16')
	}
];
