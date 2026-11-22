import { error } from '@sveltejs/kit';
import { getProjectBySlug, getAllProjects } from '#lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
	});

	const project = await getProjectBySlug(params.slug);

	if (!project) {
		throw error(404, {
			message: `Project with slug "${params.slug}" was not found.`
		});
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
