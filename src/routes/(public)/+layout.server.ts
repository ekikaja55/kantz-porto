import { getProjectSlugs } from '#lib/server/projects';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		const projectSlugs = await getProjectSlugs();
		return {
			projectSlugs
		};
	} catch {
		return {
			projectSlugs: []
		};
	}
};
