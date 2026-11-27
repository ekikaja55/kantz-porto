import { PUBLIC_PAGE_CACHE_HEADERS } from '#lib/server/cache';
import { getFeaturedProjects } from '#lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders(PUBLIC_PAGE_CACHE_HEADERS);

	const featuredProjects = await getFeaturedProjects();

	return {
		featuredProjects
	};
};
