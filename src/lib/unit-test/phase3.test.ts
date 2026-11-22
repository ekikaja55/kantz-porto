import { describe, it, expect } from 'vitest';
import { getAllProjects, getFeaturedProjects, getProjectBySlug } from '../server/projects';
import { initialProjects } from '../server/projects-seed';

describe('Phase 3: Public Experience & Project Queries', () => {
	it('validates initialProjects seed integrity', () => {
		expect(initialProjects.length).toBeGreaterThanOrEqual(7);

		for (const project of initialProjects) {
			expect(project.slug).toBeDefined();
			expect(project.slug.length).toBeGreaterThan(0);
			expect(project.title).toBeDefined();
			expect(project.tagline).toBeDefined();
			expect(project.description).toBeDefined();
			expect(Array.isArray(project.technologies)).toBe(true);
			expect(project.technologies.length).toBeGreaterThan(0);
			expect([1, 2]).toContain(project.tier);
		}
	});

	it('returns all published projects via getAllProjects', async () => {
		const projects = await getAllProjects();
		expect(Array.isArray(projects)).toBe(true);
		expect(projects.length).toBeGreaterThan(0);
		expect(projects.every((p) => p.isPublished)).toBe(true);
	});

	it('returns only tier 1 projects via getFeaturedProjects', async () => {
		const featured = await getFeaturedProjects();
		expect(Array.isArray(featured)).toBe(true);
		expect(featured.length).toBeGreaterThan(0);
		expect(featured.every((p) => p.isPublished && p.tier === 1)).toBe(true);
	});

	it('retrieves project by valid slug', async () => {
		const project = await getProjectBySlug('mlbb-voice-timer');
		expect(project).not.toBeNull();
		expect(project?.slug).toBe('mlbb-voice-timer');
		expect(project?.title).toContain('MLBB Voice Timer');
		expect(project?.tier).toBe(1);
	});

	it('returns null for nonexistent slug', async () => {
		const project = await getProjectBySlug('nonexistent-project-xyz-123');
		expect(project).toBeNull();
	});
});
