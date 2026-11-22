import { getAllProjects } from '#lib/server/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
	});

	const projects = await getAllProjects();

	return {
		projects
	};
};
