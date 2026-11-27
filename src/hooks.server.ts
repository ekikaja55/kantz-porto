import type { Handle } from '@sveltejs/kit/hooks';
import { sequence } from '@sveltejs/kit/hooks';
import { building, dev } from '$app/env';
import { auth } from '#lib/server/auth.ts';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { recordPageView } from '#lib/server/redis.ts';
import { createLogger } from '#lib/utils/logger.ts';

const log = createLogger('Hooks');

const handleAnalytics: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const isGet = event.request.method === 'GET';

	// Filter out internal static assets, API calls, and administrative paths
	const isAssetOrSystem =
		pathname.startsWith('/_app') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/admin') ||
		pathname.includes('.') ||
		pathname.startsWith('/favicon');

	if (!dev && isGet && !isAssetOrSystem) {
		let clientIp = '127.0.0.1';
		try {
			clientIp =
				event.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
				event.getClientAddress();
		} catch {
			// Fallback to localhost if getClientAddress is unavailable
		}

		log.debug(`Page hit: ${pathname} from ${clientIp}`);

		// Non-blocking fire-and-forget server-side analytics recording
		recordPageView(pathname, clientIp).catch((err) => {
			log.error('Analytics Hook Error', err);
		});
	}

	return resolve(event);
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const isAuthScoped =
		pathname.startsWith('/admin') ||
		pathname === '/login' ||
		pathname.startsWith('/login/') ||
		pathname.startsWith('/api/auth') ||
		pathname === '/api/upload' ||
		pathname.startsWith('/api/upload/');

	if (isAuthScoped) {
		const session = await auth.api.getSession({ headers: event.request.headers });

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
			log.debug(`Authenticated session resolved for user: ${session.user.email}`);
		}

		return svelteKitHandler({ event, resolve, auth, building });
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleAnalytics, handleBetterAuth);
