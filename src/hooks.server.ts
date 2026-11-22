import type { Handle } from '@sveltejs/kit/hooks';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { auth } from '#lib/server/auth.ts';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { recordPageView } from '#lib/server/redis.ts';
import { createLogger } from '#lib/utils/logger.ts';
import type { Language } from '#lib/i18n';

const log = createLogger('Hooks');

const handleI18n: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0] as Language | undefined;

	if (firstSegment === 'id' || firstSegment === 'en') {
		event.locals.lang = firstSegment;
	} else {
		const cookieLang = event.cookies.get('lang') as Language | undefined;
		if (cookieLang === 'id' || cookieLang === 'en') {
			event.locals.lang = cookieLang;
		} else {
			const acceptLang = event.request.headers.get('accept-language');
			event.locals.lang = acceptLang?.toLowerCase().startsWith('id') ? 'id' : 'en';
		}
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', event.locals.lang || 'en')
	});
};

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

	if (isGet && !isAssetOrSystem) {
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
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
		log.debug(`Authenticated session resolved for user: ${session.user.email}`);
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleI18n, handleAnalytics, handleBetterAuth);
