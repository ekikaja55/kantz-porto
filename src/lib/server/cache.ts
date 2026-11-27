import { dev } from '$app/env';

/**
 * Cache headers for public SSR routes.
 * - Local dev: `no-store` prevents browser disk caches (notably Firefox RFC 5861
 *   stale-while-revalidate) from serving stale SSR HTML against hot-reloaded client JS.
 * - Production (Vercel): browsers always revalidate (`max-age=0, must-revalidate`) while
 *   Vercel Edge caches for 1h with 24h stale-while-revalidate via `CDN-Cache-Control`.
 */
export const PUBLIC_PAGE_CACHE_HEADERS: Record<string, string> = dev
	? {
			'cache-control': 'no-store'
		}
	: {
			'cache-control': 'public, max-age=0, must-revalidate',
			'cdn-cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
		};
