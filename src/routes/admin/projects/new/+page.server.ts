import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { createProject } from '#lib/server/projects';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
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
				error: 'Title, slug, tagline, and case study description are required.',
				values: { title, slug, tagline, description, category, tier, status, techInput, liveUrl, githubUrl, orderIndex, isPublished }
			});
		}

		const technologies = techInput
			? techInput.split(',').map((t) => t.trim()).filter(Boolean)
			: [];

		try {
			await createProject({
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
			console.error('[Create Project Error]', err);
			return fail(500, {
				error: 'Failed to create project in database. Please ensure slug is unique.',
				values: { title, slug, tagline, description, category, tier, status, techInput, liveUrl, githubUrl, orderIndex, isPublished }
			});
		}

		redirect(303, resolve('/admin'));
	}
};
