import { getFeaturedProjects } from '#lib/server/projects';
import { getSkills, getExperiences } from '#lib/server/cms';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Cache on edge for 1 hour, serve stale up to 1 day while revalidating
	setHeaders({
		'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
	});

	const [featuredProjects, skillsList, experiencesList] = await Promise.all([
		getFeaturedProjects(),
		getSkills(),
		getExperiences()
	]);

	return {
		featuredProjects,
		skills: skillsList,
		experiences: experiencesList
	};
};
