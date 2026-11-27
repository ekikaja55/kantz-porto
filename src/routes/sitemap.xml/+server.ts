import { getAllProjects } from '#lib/server/projects';
import type { RequestHandler } from './$types';

const STATIC_ROUTES = ['/', '/projects', '/skills', '/experience', '/contact'] as const;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function formatDate(d: Date | string | null | undefined): string | null {
	if (!d) return null;
	try {
		return new Date(d).toISOString().slice(0, 10);
	} catch {
		return null;
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;

	const projects = await getAllProjects().catch(() => []);

	const entries: string[] = [];

	for (const path of STATIC_ROUTES) {
		entries.push(`  <url>\n    <loc>${escapeXml(`${origin}${path}`)}</loc>\n  </url>`);
	}

	for (const project of projects) {
		const loc = escapeXml(`${origin}/projects/${project.slug}`);
		const lastmod = formatDate(project.updatedAt);
		const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
		entries.push(`  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`);
	}

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries,
		'</urlset>'
	].join('\n');

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
		}
	});
};
