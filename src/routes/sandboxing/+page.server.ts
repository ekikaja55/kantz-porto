import { getFeaturedProjects, getAllProjects } from '#lib/server/projects';
import { getSkills, getExperiences } from '#lib/server/cms';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
	});

	const [featuredProjects, allProjects, skillsList, experiencesList] = await Promise.all([
		getFeaturedProjects(),
		getAllProjects(),
		getSkills(),
		getExperiences()
	]);

	return {
		featuredProjects,
		projects: allProjects,
		skills: skillsList,
		experiences: experiencesList
	};
};

export const actions: Actions = {
	contact: async ({ request }) => {
		const form = await request.formData();
		const honeypot = form.get('website')?.toString()?.trim();
		if (honeypot) {
			return fail(400, { success: false, message: 'Spam detected.' });
		}
		const name = form.get('name')?.toString()?.trim();
		const email = form.get('email')?.toString()?.trim();
		const message = form.get('message')?.toString()?.trim();

		if (!name || !email || !message) {
			return fail(400, { success: false, message: 'All fields are required.' });
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { success: false, message: 'Please provide a valid email address.' });
		}

		return { success: true, message: 'Message sent successfully. I will get back to you shortly.' };
	}
};
