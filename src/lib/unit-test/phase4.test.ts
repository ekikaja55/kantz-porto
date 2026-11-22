import { describe, it, expect } from 'vitest';
import {
	getAdminProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	toggleProjectPublished,
	reorderProject
} from '../server/projects';
import { ensureAdminUser } from '../server/auth-seed';

describe('Phase 4: Admin Portal & Dynamic CMS Helpers', () => {
	it('retrieves all admin projects successfully', async () => {
		const projects = await getAdminProjects();
		expect(Array.isArray(projects)).toBe(true);
		expect(projects.length).toBeGreaterThanOrEqual(7);
	});

	it('finds project by ID or returns null if not found', async () => {
		const all = await getAdminProjects();
		const first = all[0];
		expect(first).toBeDefined();

		const found = await getProjectById(first.id);
		expect(found).not.toBeNull();
		expect(found?.id).toBe(first.id);

		const missing = await getProjectById('non-existent-uuid-999');
		expect(missing).toBeNull();
	});

	it('creates, updates, toggles, and deletes a temporary test project in database', async () => {
		const testSlug = `vitest-test-proj-${Date.now()}`;

		// 1. Create
		const created = await createProject({
			title: 'Vitest Automated CMS Test',
			slug: testSlug,
			tagline: 'Temporary project created by Phase 4 test suite',
			description: '### Test Summary\nAutomated testing of CMS CRUD operations.',
			category: 'systems',
			tier: 2,
			status: 'in-progress',
			technologies: ['TypeScript', 'Vitest', 'Drizzle ORM'],
			orderIndex: 999,
			isPublished: false
		});

		expect(created).toBeDefined();
		expect(created.id).toBeDefined();
		expect(created.slug).toBe(testSlug);
		expect(created.isPublished).toBe(false);

		// 2. Update
		const updated = await updateProject(created.id, {
			tagline: 'Updated tagline for test project'
		});
		expect(updated).not.toBeNull();
		expect(updated?.tagline).toBe('Updated tagline for test project');

		// 3. Toggle Published
		const toggled = await toggleProjectPublished(created.id);
		expect(toggled).not.toBeNull();
		expect(toggled?.isPublished).toBe(true);

		// 4. Delete
		const deleted = await deleteProject(created.id);
		expect(deleted).toBe(true);

		// 5. Verify Deletion
		const verifyDeleted = await getProjectById(created.id);
		expect(verifyDeleted).toBeNull();
	});

	it('ensures admin seeding logic executes safely', async () => {
		const result = await ensureAdminUser();
		expect(result).toBeDefined();
		expect(typeof result.seeded).toBe('boolean');
		expect(typeof result.message).toBe('string');
	});

	it('reorders projects atomically up and down', async () => {
		const projects = await getAdminProjects();
		expect(projects.length).toBeGreaterThanOrEqual(2);

		const firstId = projects[0].id;
		const secondId = projects[1].id;

		// Move first project down (swapping with second)
		const downResult = await reorderProject(firstId, 'down');
		expect(downResult).toBe(true);

		const afterDown = await getAdminProjects();
		expect(afterDown[0].id).toBe(secondId);
		expect(afterDown[1].id).toBe(firstId);

		// Move it back up to restore original order
		const upResult = await reorderProject(firstId, 'up');
		expect(upResult).toBe(true);

		const afterUp = await getAdminProjects();
		expect(afterUp[0].id).toBe(firstId);
		expect(afterUp[1].id).toBe(secondId);

		// Boundary test: moving first project up should succeed gracefully (noop)
		const boundaryResult = await reorderProject(firstId, 'up');
		expect(boundaryResult).toBe(true);
	}, 15000);
});
