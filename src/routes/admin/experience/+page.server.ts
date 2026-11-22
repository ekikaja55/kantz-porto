import { fail } from '@sveltejs/kit';
import {
	getExperiences,
	createExperience,
	updateExperience,
	deleteExperience
} from '#lib/server/cms';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const experiences = await getExperiences();
	return {
		experiences
	};
};

export const actions: Actions = {
	createExperience: async ({ request }) => {
		const formData = await request.formData();
		const period = formData.get('period')?.toString().trim();
		const company = formData.get('company')?.toString().trim();
		const role = formData.get('role')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const highlightsRaw = formData.get('highlights')?.toString().trim() || '';
		const orderIndex = parseInt(formData.get('orderIndex')?.toString() || '0', 10);

		if (!period || !company || !role || !description) {
			return fail(400, { error: 'Period, company, role, and description are required' });
		}

		const highlights = highlightsRaw
			? highlightsRaw
					.split('\n')
					.map((h) => h.trim())
					.filter(Boolean)
			: [];

		try {
			await createExperience({
				period,
				company,
				role,
				description,
				highlights,
				orderIndex
			});
			return { success: true };
		} catch (err) {
			console.error('[Create Experience Error]', err);
			return fail(500, { error: 'Failed to create experience milestone' });
		}
	},

	updateExperience: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const period = formData.get('period')?.toString().trim();
		const company = formData.get('company')?.toString().trim();
		const role = formData.get('role')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const highlightsRaw = formData.get('highlights')?.toString().trim() || '';
		const orderIndex = parseInt(formData.get('orderIndex')?.toString() || '0', 10);

		if (!id || !period || !company || !role || !description) {
			return fail(400, { error: 'Missing required experience fields' });
		}

		const highlights = highlightsRaw
			? highlightsRaw
					.split('\n')
					.map((h) => h.trim())
					.filter(Boolean)
			: [];

		try {
			await updateExperience(id, {
				period,
				company,
				role,
				description,
				highlights,
				orderIndex
			});
			return { success: true };
		} catch (err) {
			console.error('[Update Experience Error]', err);
			return fail(500, { error: 'Failed to update experience milestone' });
		}
	},

	deleteExperience: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing experience id' });
		}

		try {
			await deleteExperience(id);
			return { success: true };
		} catch (err) {
			console.error('[Delete Experience Error]', err);
			return fail(500, { error: 'Failed to delete experience milestone' });
		}
	}
};
