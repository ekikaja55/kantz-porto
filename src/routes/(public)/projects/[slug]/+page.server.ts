import { error } from '@sveltejs/kit';
import { PUBLIC_PAGE_CACHE_HEADERS } from '#lib/server/cache';
import { getProjectBySlug, getAllProjects } from '#lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders(PUBLIC_PAGE_CACHE_HEADERS);

	const project = await getProjectBySlug(params.slug);

	if (!project) {
		error(404, `open: no such project: ${params.slug}`);
	}

	const allProjects = await getAllProjects();
	const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);

	const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
	const nextProject =
		currentIndex >= 0 && currentIndex < allProjects.length - 1
			? allProjects[currentIndex + 1]
			: null;

	return {
		project,
		prevProject,
		nextProject
	};
};
