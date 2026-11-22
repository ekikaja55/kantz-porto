import type { Skill, Experience } from './db/schema';

export const INITIAL_SKILLS: Omit<Skill, 'createdAt'>[] = [
	// Languages
	{ id: 'skill-ts', category: 'languages', name: 'TypeScript', icon: 'solar:code-file-bold-duotone', orderIndex: 1 },
	{ id: 'skill-js', category: 'languages', name: 'JavaScript', icon: 'solar:code-file-bold-duotone', orderIndex: 2 },
	{ id: 'skill-py', category: 'languages', name: 'Python', icon: 'solar:code-file-bold-duotone', orderIndex: 3 },
	{ id: 'skill-cpp', category: 'languages', name: 'C & C++', icon: 'solar:code-file-bold-duotone', orderIndex: 4 },
	{ id: 'skill-cs', category: 'languages', name: 'C# (.NET)', icon: 'solar:code-file-bold-duotone', orderIndex: 5 },
	{ id: 'skill-php', category: 'languages', name: 'PHP', icon: 'solar:code-file-bold-duotone', orderIndex: 6 },
	{ id: 'skill-sql', category: 'languages', name: 'SQL', icon: 'solar:database-bold-duotone', orderIndex: 7 },

	// Frameworks & Runtimes
	{ id: 'skill-sv5', category: 'frameworks', name: 'Svelte 5', icon: 'solar:widget-bold-duotone', orderIndex: 8 },
	{ id: 'skill-svk', category: 'frameworks', name: 'SvelteKit', icon: 'solar:widget-bold-duotone', orderIndex: 9 },
	{ id: 'skill-react', category: 'frameworks', name: 'React', icon: 'solar:widget-bold-duotone', orderIndex: 10 },
	{ id: 'skill-next', category: 'frameworks', name: 'Next.js', icon: 'solar:widget-bold-duotone', orderIndex: 11 },
	{ id: 'skill-flutter', category: 'frameworks', name: 'Flutter', icon: 'solar:widget-bold-duotone', orderIndex: 12 },
	{ id: 'skill-node', category: 'frameworks', name: 'Node.js', icon: 'solar:widget-bold-duotone', orderIndex: 13 },
	{ id: 'skill-express', category: 'frameworks', name: 'Express', icon: 'solar:widget-bold-duotone', orderIndex: 14 },
	{ id: 'skill-tw', category: 'frameworks', name: 'Tailwind CSS', icon: 'solar:widget-bold-duotone', orderIndex: 15 },

	// Databases & Infrastructure
	{ id: 'skill-pg', category: 'databases', name: 'PostgreSQL', icon: 'solar:database-bold-duotone', orderIndex: 16 },
	{ id: 'skill-supa', category: 'databases', name: 'Supabase', icon: 'solar:database-bold-duotone', orderIndex: 17 },
	{ id: 'skill-drizzle', category: 'databases', name: 'Drizzle ORM', icon: 'solar:database-bold-duotone', orderIndex: 18 },
	{ id: 'skill-redis', category: 'databases', name: 'Upstash Redis', icon: 'solar:database-bold-duotone', orderIndex: 19 },
	{ id: 'skill-mongo', category: 'databases', name: 'MongoDB', icon: 'solar:database-bold-duotone', orderIndex: 20 },
	{ id: 'skill-vercel', category: 'databases', name: 'Vercel', icon: 'solar:server-bold-duotone', orderIndex: 21 },

	// Systems & Tooling
	{ id: 'skill-audio', category: 'systems', name: 'Web Audio API', icon: 'solar:tuning-bold-duotone', orderIndex: 22 },
	{ id: 'skill-worker', category: 'systems', name: 'Web Workers', icon: 'solar:tuning-bold-duotone', orderIndex: 23 },
	{ id: 'skill-git', category: 'systems', name: 'Git', icon: 'solar:tuning-bold-duotone', orderIndex: 24 },
	{ id: 'skill-linux', category: 'systems', name: 'Linux', icon: 'solar:tuning-bold-duotone', orderIndex: 25 },
	{ id: 'skill-vitest', category: 'systems', name: 'Vitest', icon: 'solar:tuning-bold-duotone', orderIndex: 26 },
	{ id: 'skill-playwright', category: 'systems', name: 'Playwright', icon: 'solar:tuning-bold-duotone', orderIndex: 27 },
	{ id: 'skill-eslint', category: 'systems', name: 'ESLint', icon: 'solar:tuning-bold-duotone', orderIndex: 28 }
];

export const INITIAL_EXPERIENCES: Omit<Experience, 'createdAt'>[] = [
	{
		id: 'exp-1',
		period: '2025 — PRESENT',
		role: 'Software Engineer & Fullstack Developer',
		company: 'Independent / Freelance',
		description:
			'Architecting and delivering high-performance reactive web systems, real-time gaming audio HUDs, and automated commerce tools. Focused on Svelte 5, TypeScript, Supabase, and low-level browser APIs.',
		highlights: [
			'MLBB Voice Timer (Speech NLP HUD)',
			'Invoizy (Automated Order-to-Invoice SaaS)',
			'Craftique-ID (Modular Artist Marketplace)'
		],
		orderIndex: 1
	},
	{
		id: 'exp-2',
		period: '2023 — 2025',
		role: 'Student Developer & CS Foundations',
		company: 'Academic & Foundation Research',
		description:
			'Focused on foundational software engineering, Object-Oriented Programming (OOP) design patterns, and cross-platform accessibility development.',
		highlights: [
			'Tutur.id (On-device BISINDO computer vision)',
			'Belajar Aksara (Unity 2D cultural game v1.0.0)',
			'MathQuest (Python OOP State Pattern engine)'
		],
		orderIndex: 2
	}
];
