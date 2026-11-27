import { describe, it, expect } from 'vitest';
import {
	getSkills,
	createSkill,
	updateSkill,
	deleteSkill,
	getExperiences,
	createExperience,
	updateExperience,
	deleteExperience
} from '#lib/server/cms';

describe('CMS Capabilities & Milestones Operations', () => {
	it('retrieves skills and ensures default seeding fallback', async () => {
		const skills = await getSkills();
		expect(Array.isArray(skills)).toBe(true);
		expect(skills.length).toBeGreaterThan(0);

		const languages = skills.filter((s) => s.category === 'languages');
		expect(languages.length).toBeGreaterThan(0);
	});

	it('creates, updates, and deletes a temporary skill', async () => {
		const tempId = `test-skill-${Date.now()}`;
		const created = await createSkill({
			id: tempId,
			name: 'Zig Systems',
			category: 'languages',
			orderIndex: 99
		});

		expect(created.id).toBe(tempId);
		expect(created.name).toBe('Zig Systems');

		const updated = await updateSkill(tempId, { name: 'Zig Systems v0.14' });
		expect(updated).not.toBeNull();
		expect(updated?.name).toBe('Zig Systems v0.14');

		const deleted = await deleteSkill(tempId);
		expect(deleted).toBe(true);
	});

	it('retrieves experiences and ensures default milestones', async () => {
		const experiences = await getExperiences();
		expect(Array.isArray(experiences)).toBe(true);
		expect(experiences.length).toBeGreaterThan(0);

		const first = experiences[0];
		expect(first.role).toBeTruthy();
		expect(first.company).toBeTruthy();
	});

	it('creates, updates, and deletes a temporary experience milestone', async () => {
		const tempId = `test-exp-${Date.now()}`;
		const created = await createExperience({
			id: tempId,
			period: '2026',
			company: 'Acme Test Corp',
			role: 'Staff Systems Architect',
			description: 'Building distributed real-time audio systems.',
			highlights: ['Sub-10ms audio processing', 'Zero memory leaks'],
			orderIndex: 99
		});

		expect(created.id).toBe(tempId);
		expect(created.company).toBe('Acme Test Corp');

		const updated = await updateExperience(tempId, {
			company: 'Acme Global Corp'
		});
		expect(updated).not.toBeNull();
		expect(updated?.company).toBe('Acme Global Corp');

		const deleted = await deleteExperience(tempId);
		expect(deleted).toBe(true);
	});
});
