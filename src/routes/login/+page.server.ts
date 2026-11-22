import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { auth } from '#lib/server/auth';
import { checkLoginRateLimit } from '#lib/server/redis';
import { ensureAdminUser } from '#lib/server/auth-seed';
import { createLogger } from '#lib/utils/logger.ts';
import type { PageServerLoad, Actions } from './$types';

const log = createLogger('Login');

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	setHeaders({
		'cache-control': 'no-store, max-age=0'
	});

	// If already authenticated, redirect straight to admin dashboard
	if (locals.session && locals.user) {
		redirect(303, resolve('/admin'));
	}

	// Ensure the admin user specified in environment variables is seeded
	await ensureAdminUser();

	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const { request, getClientAddress } = event;
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, {
				error: 'Please provide both email and password.',
				email: email || ''
			});
		}

		// Security: rate limit login attempts via Upstash Redis
		let clientIp = '127.0.0.1';
		try {
			clientIp =
				request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
				(getClientAddress ? getClientAddress() : '127.0.0.1');
		} catch {
			// Fallback to localhost if IP resolution fails
		}

		const rateLimit = await checkLoginRateLimit(clientIp);
		if (!rateLimit.success) {
			return fail(429, {
				error: 'Too many login attempts. Please wait 15 minutes before trying again.',
				email
			});
		}

		try {
			await auth.api.signInEmail({
				body: { email, password },
				headers: request.headers
			});
			log.info(`Admin successfully authenticated: ${email}`);
		} catch (err) {
			log.warn('Authentication failed for email:', email, err instanceof Error ? err.message : err);
			return fail(401, {
				error: 'Invalid email or password credentials.',
				email
			});
		}

		redirect(303, resolve('/admin'));
	}
};
