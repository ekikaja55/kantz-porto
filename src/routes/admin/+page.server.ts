import { redirect, fail } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { auth } from '#lib/server/auth';
import { getAnalyticsSummary } from '#lib/server/redis';
import {
	getAdminProjects,
	toggleProjectPublished,
	deleteProject
} from '#lib/server/projects';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const [analytics, projects] = await Promise.all([
		getAnalyticsSummary(),
		getAdminProjects()
	]);

	return {
		analytics,
		projects
	};
};

export const actions: Actions = {
	logout: async ({ request }) => {
		try {
			await auth.api.signOut({
				headers: request.headers
			});
		} catch (err) {
			console.warn('[Logout Error]', err instanceof Error ? err.message : err);
		}

		redirect(303, resolve('/login'));
	},

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
	}
};
