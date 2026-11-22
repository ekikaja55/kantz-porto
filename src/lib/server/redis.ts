import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$app/env/private';
import { createLogger } from '#lib/utils/logger.ts';

const log = createLogger('Redis');

const hasRedisCredentials = Boolean(
	UPSTASH_REDIS_REST_URL &&
		UPSTASH_REDIS_REST_TOKEN &&
		!UPSTASH_REDIS_REST_URL.includes('your-upstash')
);

export const redis = hasRedisCredentials
	? new Redis({
			url: UPSTASH_REDIS_REST_URL,
			token: UPSTASH_REDIS_REST_TOKEN
		})
	: null;

export const loginRateLimiter = redis
	? new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(5, '15 m'),
			analytics: true,
			prefix: 'ratelimit:login'
		})
	: null;

export async function checkLoginRateLimit(identifier: string) {
	if (!loginRateLimiter) {
		return { success: true, remaining: 5, reset: 0 };
	}
	try {
		const result = await loginRateLimiter.limit(identifier);
		return {
			success: result.success,
			remaining: result.remaining,
			reset: result.reset
		};
	} catch (error) {
		log.error('Error checking rate limit:', error);
		// Gracefully allow on unexpected redis connection error so auth is not completely hard-locked
		return { success: true, remaining: 1, reset: 0 };
	}
}

export async function recordPageView(pathname: string, clientIp: string) {
	if (!redis) return;

	try {
		const today = new Date().toISOString().split('T')[0];
		const pipeline = redis.pipeline();

		// Increment global lifetime pageviews
		pipeline.incr('analytics:views:total');

		// Track daily unique visitors using HyperLogLog (memory-efficient)
		pipeline.pfadd(`analytics:uniques:${today}`, clientIp);

		// Track route hits
		pipeline.zincrby('analytics:paths', 1, pathname);

		// If viewing an individual project case study, track project specific popularity
		if (pathname.startsWith('/projects/') && pathname !== '/projects/') {
			const projectSlug = pathname.replace('/projects/', '').split('/')[0];
			if (projectSlug) {
				pipeline.zincrby('analytics:projects', 1, projectSlug);
			}
		}

		await pipeline.exec();
	} catch (error) {
		log.error('Failed to record pageview in Redis:', error);
	}
}

export interface AnalyticsSummary {
	totalViews: number;
	uniqueVisitorsToday: number;
	topProjects: { slug: string; views: number }[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
	if (!redis) {
		return {
			totalViews: 0,
			uniqueVisitorsToday: 0,
			topProjects: []
		};
	}

	try {
		const today = new Date().toISOString().split('T')[0];

		const [totalViews, uniqueVisitorsToday, topProjectsRaw] = await Promise.all([
			redis.get<number>('analytics:views:total'),
			redis.pfcount(`analytics:uniques:${today}`),
			redis.zrange('analytics:projects', 0, 4, { rev: true, withScores: true })
		]);

		const topProjects: { slug: string; views: number }[] = [];
		if (Array.isArray(topProjectsRaw)) {
			for (let i = 0; i < topProjectsRaw.length; i += 2) {
				topProjects.push({
					slug: String(topProjectsRaw[i]),
					views: Number(topProjectsRaw[i + 1]) || 0
				});
			}
		}

		return {
			totalViews: totalViews ?? 0,
			uniqueVisitorsToday: uniqueVisitorsToday ?? 0,
			topProjects
		};
	} catch (error) {
		console.error('[Analytics] Failed to retrieve analytics summary:', error);
		return {
			totalViews: 0,
			uniqueVisitorsToday: 0,
			topProjects: []
		};
	}
}
