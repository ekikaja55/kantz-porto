import { db } from './db';
import { skills, experiences, type Skill, type NewSkill, type Experience, type NewExperience } from './db/schema';
import { INITIAL_SKILLS, INITIAL_EXPERIENCES } from './cms-seed';
import { eq, asc } from 'drizzle-orm';
import { createLogger } from '#lib/utils/logger.ts';

const log = createLogger('CMS');

// ---------------------------------------------------------------------------
// Skills Operations
// ---------------------------------------------------------------------------

export async function seedSkillsIfEmpty(): Promise<boolean> {
	try {
		const existing = await db.select({ id: skills.id }).from(skills).limit(1);
		if (existing.length === 0) {
			await db.insert(skills).values(INITIAL_SKILLS);
			log.info('Seeded initial skills into database');
			return true;
		}
	} catch (error) {
		log.warn('Seed Skills Error:', error);
	}
	return false;
}

export async function getSkills(): Promise<Skill[]> {
	try {
		await seedSkillsIfEmpty();
		const result = await db.select().from(skills).orderBy(asc(skills.orderIndex));
		if (result && result.length > 0) {
			return result;
		}
	} catch (error) {
		log.warn('Skills Query Falling back to initial seed data:', error);
	}

	return INITIAL_SKILLS.map((s) => ({
		...s,
		icon: s.icon ?? null,
		createdAt: new Date()
	}));
}

export async function getSkillById(id: string): Promise<Skill | null> {
	try {
		const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
		if (result && result.length > 0) {
			return result[0];
		}
	} catch (error) {
		log.warn('Skill By ID Query Error:', error);
	}

	const fallback = INITIAL_SKILLS.find((s) => s.id === id);
	return fallback ? { ...fallback, icon: fallback.icon ?? null, createdAt: new Date() } : null;
}

export async function createSkill(data: Omit<NewSkill, 'id' | 'createdAt'> & { id?: string }): Promise<Skill> {
	const [inserted] = await db.insert(skills).values(data).returning();
	return inserted;
}

export async function updateSkill(id: string, data: Partial<NewSkill>): Promise<Skill | null> {
	const [updated] = await db.update(skills).set(data).where(eq(skills.id, id)).returning();
	return updated || null;
}

export async function deleteSkill(id: string): Promise<boolean> {
	const [deleted] = await db.delete(skills).where(eq(skills.id, id)).returning({ id: skills.id });
	return !!deleted;
}

// ---------------------------------------------------------------------------
// Experiences Operations
// ---------------------------------------------------------------------------

export async function seedExperiencesIfEmpty(): Promise<boolean> {
	try {
		const existing = await db.select({ id: experiences.id }).from(experiences).limit(1);
		if (existing.length === 0) {
			await db.insert(experiences).values(INITIAL_EXPERIENCES);
			log.info('Seeded initial experiences into database');
			return true;
		}
	} catch (error) {
		log.warn('Seed Experiences Error:', error);
	}
	return false;
}

export async function getExperiences(): Promise<Experience[]> {
	try {
		await seedExperiencesIfEmpty();
		const result = await db.select().from(experiences).orderBy(asc(experiences.orderIndex));
		if (result && result.length > 0) {
			return result;
		}
	} catch (error) {
		log.warn('Experiences Query Falling back to initial seed data:', error);
	}

	return INITIAL_EXPERIENCES.map((e) => ({
		...e,
		createdAt: new Date()
	}));
}

export async function getExperienceById(id: string): Promise<Experience | null> {
	try {
		const result = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
		if (result && result.length > 0) {
			return result[0];
		}
	} catch (error) {
		log.warn('Experience By ID Query Error:', error);
	}

	const fallback = INITIAL_EXPERIENCES.find((e) => e.id === id);
	return fallback ? { ...fallback, createdAt: new Date() } : null;
}

export async function createExperience(
	data: Omit<NewExperience, 'id' | 'createdAt'> & { id?: string }
): Promise<Experience> {
	const [inserted] = await db.insert(experiences).values(data).returning();
	return inserted;
}

export async function updateExperience(id: string, data: Partial<NewExperience>): Promise<Experience | null> {
	const [updated] = await db.update(experiences).set(data).where(eq(experiences.id, id)).returning();
	return updated || null;
}

export async function deleteExperience(id: string): Promise<boolean> {
	const [deleted] = await db.delete(experiences).where(eq(experiences.id, id)).returning({ id: experiences.id });
	return !!deleted;
}
