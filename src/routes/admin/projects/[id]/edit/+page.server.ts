import { error, fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { getProjectById, updateProject } from '#lib/server/projects';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const project = await getProjectById(params.id);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const formData = await request.formData();

		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim().toLowerCase();
		const tagline = formData.get('tagline')?.toString().trim();
		const description = formData.get('description')?.toString().trim();
		const category = formData.get('category')?.toString().trim() || 'web';
		const tier = parseInt(formData.get('tier')?.toString() || '2', 10);
		const status = formData.get('status')?.toString().trim() || 'live';
		const techInput = formData.get('technologies')?.toString().trim() || '';
		const liveUrl = formData.get('liveUrl')?.toString().trim() || null;
		const githubUrl = formData.get('githubUrl')?.toString().trim() || null;
		const orderIndex = parseInt(formData.get('orderIndex')?.toString() || '0', 10);
		const isPublished = formData.get('isPublished') === 'true';

		const imagesRaw = formData.get('images')?.toString();
		let images: string[] = [];
		if (imagesRaw) {
			try {
				const parsed = JSON.parse(imagesRaw);
				if (Array.isArray(parsed)) images = parsed.slice(0, 3);
			} catch {
				images = [];
			}
		}

		if (!title || !slug || !tagline || !description) {
			return fail(400, {
				error: 'Title, slug, tagline, and case study description are required.'
			});
		}

		const technologies = techInput
			? techInput.split(',').map((t) => t.trim()).filter(Boolean)
			: [];

		try {
			await updateProject(params.id, {
				title,
				slug,
				tagline,
				description,
				category,
				tier: tier === 1 ? 1 : 2,
				status,
				technologies,
				images,
				liveUrl,
				githubUrl,
				orderIndex,
				isPublished
			});
		} catch (err) {
			console.error('[Update Project Error]', err);
			return fail(500, {
				error: 'Failed to update project. Please ensure slug is unique.'
			});
		}

		redirect(303, resolve('/admin'));
	}
};
