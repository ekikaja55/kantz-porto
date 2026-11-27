import { fail } from '@sveltejs/kit';
import { getSkills, createSkill, updateSkill, deleteSkill } from '#lib/server/cms';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const skills = await getSkills();
	return {
		skills
	};
};

export const actions: Actions = {
	createSkill: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const category = formData.get('category')?.toString().trim() || 'languages';
		const orderIndex = parseInt(formData.get('orderIndex')?.toString() || '0', 10);

		if (!name) {
			return fail(400, { error: 'Skill name is required' });
		}

		try {
			await createSkill({
				category,
				name,
				orderIndex
			});
			return { success: true };
		} catch (err) {
			console.error('[Create Skill Error]', err);
			return fail(500, { error: 'Failed to create skill' });
		}
	},

	updateSkill: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString().trim();
		const category = formData.get('category')?.toString().trim();
		const orderIndex = parseInt(formData.get('orderIndex')?.toString() || '0', 10);

		if (!id || !name || !category) {
			return fail(400, { error: 'Missing required skill fields' });
		}

		try {
			await updateSkill(id, {
				name,
				category,
				orderIndex
			});
			return { success: true };
		} catch (err) {
			console.error('[Update Skill Error]', err);
			return fail(500, { error: 'Failed to update skill' });
		}
	},

	deleteSkill: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing skill id' });
		}

		try {
			await deleteSkill(id);
			return { success: true };
		} catch (err) {
			console.error('[Delete Skill Error]', err);
			return fail(500, { error: 'Failed to delete skill' });
		}
	}
};
