import { describe, it, expect } from 'vitest';
import { projects, user, session, account } from '../server/db/schema';
import { checkLoginRateLimit, getAnalyticsSummary } from '../server/redis';
import { ensureAdminUser } from '../server/auth-seed';

describe('Phase 1: Database Schema Definitions', () => {
	it('defines the projects table with all expected columns', () => {
		expect(projects).toBeDefined();
		expect(projects.id).toBeDefined();
		expect(projects.slug).toBeDefined();
		expect(projects.title).toBeDefined();
		expect(projects.tagline).toBeDefined();
		expect(projects.description).toBeDefined();
		expect(projects.category).toBeDefined();
		expect(projects.tier).toBeDefined();
		expect(projects.status).toBeDefined();
		expect(projects.technologies).toBeDefined();
		expect(projects.liveUrl).toBeDefined();
		expect(projects.githubUrl).toBeDefined();
		expect(projects.thumbnailUrl).toBeDefined();
		expect(projects.orderIndex).toBeDefined();
		expect(projects.isPublished).toBeDefined();
		expect(projects.createdAt).toBeDefined();
		expect(projects.updatedAt).toBeDefined();
	});

	it('defines the Better Auth tables properly', () => {
		expect(user).toBeDefined();
		expect(session).toBeDefined();
		expect(account).toBeDefined();
	});
});

describe('Phase 1: Security & Rate Limiting Fallbacks', () => {
	it('safely handles login rate limit check with graceful fallback', async () => {
		const result = await checkLoginRateLimit('127.0.0.1');
		expect(result).toBeDefined();
		expect(typeof result.success).toBe('boolean');
		expect(result.success).toBe(true);
	});

	it('returns a valid structured analytics summary', async () => {
		const summary = await getAnalyticsSummary();
		expect(summary).toBeDefined();
		expect(typeof summary.totalViews).toBe('number');
		expect(typeof summary.uniqueVisitorsToday).toBe('number');
		expect(Array.isArray(summary.topProjects)).toBe(true);
	});
});

describe('Phase 1: Admin Seeding Logic', () => {
	it('gracefully handles seeding check', async () => {
		const seedResult = await ensureAdminUser();
		expect(seedResult).toBeDefined();
		expect(typeof seedResult.seeded).toBe('boolean');
		expect(typeof seedResult.message).toBe('string');
	});
});
