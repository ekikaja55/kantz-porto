import type { Skill, Experience } from './db/schema';

export const INITIAL_SKILLS: Omit<Skill, 'createdAt'>[] = [
	// Languages
	{ id: 'skill-ts', category: 'languages', name: 'TypeScript', orderIndex: 1 },
	{ id: 'skill-js', category: 'languages', name: 'JavaScript', orderIndex: 2 },
	{ id: 'skill-py', category: 'languages', name: 'Python', orderIndex: 3 },
	{ id: 'skill-cpp', category: 'languages', name: 'C & C++', orderIndex: 4 },
	{ id: 'skill-cs', category: 'languages', name: 'C# (.NET)', orderIndex: 5 },
	{ id: 'skill-php', category: 'languages', name: 'PHP', orderIndex: 6 },
	{ id: 'skill-sql', category: 'languages', name: 'SQL', orderIndex: 7 },

	// Frameworks & Runtimes
	{ id: 'skill-sv5', category: 'frameworks', name: 'Svelte 5', orderIndex: 8 },
	{ id: 'skill-svk', category: 'frameworks', name: 'SvelteKit', orderIndex: 9 },
	{ id: 'skill-react', category: 'frameworks', name: 'React', orderIndex: 10 },
	{ id: 'skill-next', category: 'frameworks', name: 'Next.js', orderIndex: 11 },
	{ id: 'skill-flutter', category: 'frameworks', name: 'Flutter', orderIndex: 12 },
	{ id: 'skill-node', category: 'frameworks', name: 'Node.js', orderIndex: 13 },
	{ id: 'skill-express', category: 'frameworks', name: 'Express', orderIndex: 14 },
	{ id: 'skill-tw', category: 'frameworks', name: 'Tailwind CSS', orderIndex: 15 },

	// Databases & Infrastructure
	{ id: 'skill-pg', category: 'databases', name: 'PostgreSQL', orderIndex: 16 },
	{ id: 'skill-supa', category: 'databases', name: 'Supabase', orderIndex: 17 },
	{ id: 'skill-drizzle', category: 'databases', name: 'Drizzle ORM', orderIndex: 18 },
	{ id: 'skill-redis', category: 'databases', name: 'Upstash Redis', orderIndex: 19 },
	{ id: 'skill-mongo', category: 'databases', name: 'MongoDB', orderIndex: 20 },
	{ id: 'skill-vercel', category: 'databases', name: 'Vercel', orderIndex: 21 },

	// Systems & Tooling
	{ id: 'skill-audio', category: 'systems', name: 'Web Audio API', orderIndex: 22 },
	{ id: 'skill-worker', category: 'systems', name: 'Web Workers', orderIndex: 23 },
	{ id: 'skill-git', category: 'systems', name: 'Git', orderIndex: 24 },
	{ id: 'skill-linux', category: 'systems', name: 'Linux', orderIndex: 25 },
	{ id: 'skill-vitest', category: 'systems', name: 'Vitest', orderIndex: 26 },
	{ id: 'skill-playwright', category: 'systems', name: 'Playwright', orderIndex: 27 },
	{ id: 'skill-eslint', category: 'systems', name: 'ESLint', orderIndex: 28 }
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
