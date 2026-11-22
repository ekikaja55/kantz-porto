import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store, max-age=0'
	});

	// Guard: check if session and user exist in locals (set by handleBetterAuth in hooks.server.ts)
	if (!locals.session || !locals.user) {
		redirect(303, resolve('/login'));
	}

	return {
		user: locals.user
	};
};
