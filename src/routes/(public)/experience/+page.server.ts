import { PUBLIC_PAGE_CACHE_HEADERS } from '#lib/server/cache';
import { getExperiences } from '#lib/server/cms';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders(PUBLIC_PAGE_CACHE_HEADERS);

	const experiences = await getExperiences();

	return {
		experiences
	};
};
