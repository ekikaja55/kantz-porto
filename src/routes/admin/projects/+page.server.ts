import { fail } from '@sveltejs/kit';
import {
	getAdminProjects,
	toggleProjectPublished,
	deleteProject,
	reorderProject
} from '#lib/server/projects';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const projects = await getAdminProjects();
	return {
		projects
	};
};

export const actions: Actions = {
	togglePublished: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing project id' });
		}

		const updated = await toggleProjectPublished(id);
		if (!updated) {
			return fail(404, { error: 'Project not found' });
		}

		return { success: true };
	},

	deleteProject: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing project id' });
		}

		const success = await deleteProject(id);
		if (!success) {
			return fail(404, { error: 'Failed to delete project or project not found' });
		}

		return { success: true };
	},

	reorder: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const direction = formData.get('direction')?.toString();

		if (!id || (direction !== 'up' && direction !== 'down')) {
			return fail(400, { error: 'Invalid reorder parameters' });
		}

		const success = await reorderProject(id, direction);
		if (!success) {
			return fail(500, { error: 'Failed to reorder project' });
		}

		return { success: true };
	}
};
