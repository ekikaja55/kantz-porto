import { db } from './db';
import { projects, type Project, type NewProject } from './db/schema';
import { initialProjects } from './projects-seed';
import { eq, asc, desc, and } from 'drizzle-orm';
import { createLogger } from '#lib/utils/logger.ts';

const log = createLogger('Projects');

export async function seedProjectsIfEmpty(): Promise<boolean> {
	try {
		const existing = await db.select({ id: projects.id }).from(projects).limit(1);
		if (existing.length === 0) {
			await db.insert(projects).values(initialProjects);
			log.info('Seeded initial projects into database');
			return true;
		}
	} catch (error) {
		log.warn('Seed Projects Error:', error);
	}
	return false;
}

export async function getAllProjects(): Promise<Project[]> {
	try {
		await seedProjectsIfEmpty();
		const result = await db
			.select()
			.from(projects)
			.where(eq(projects.isPublished, true))
			.orderBy(asc(projects.orderIndex), desc(projects.createdAt));

		if (result && result.length > 0) {
			return result;
		}
	} catch (error) {
		log.warn('Projects Query Falling back to initial seed data:', error);
	}

	return initialProjects.filter((p) => p.isPublished);
}

export async function getFeaturedProjects(): Promise<Project[]> {
	try {
		await seedProjectsIfEmpty();
		const result = await db
			.select()
			.from(projects)
			.where(and(eq(projects.isPublished, true), eq(projects.tier, 1)))
			.orderBy(asc(projects.orderIndex), desc(projects.createdAt));

		if (result && result.length > 0) {
			return result;
		}
	} catch (error) {
		log.warn('Projects Featured Query Falling back to initial seed data:', error);
	}

	return initialProjects.filter((p) => p.isPublished && p.tier === 1);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
	try {
		await seedProjectsIfEmpty();
		const result = await db
			.select()
			.from(projects)
			.where(and(eq(projects.slug, slug), eq(projects.isPublished, true)))
			.limit(1);

		if (result && result.length > 0) {
			return result[0];
		}
	} catch (error) {
		log.warn('Project Slug Query Falling back to initial seed data:', error);
	}

	const found = initialProjects.find((p) => p.slug === slug && p.isPublished);
	return found || null;
}

export async function getAdminProjects(): Promise<Project[]> {
	try {
		await seedProjectsIfEmpty();
		const result = await db
			.select()
			.from(projects)
			.orderBy(asc(projects.orderIndex), desc(projects.createdAt));

		if (result && result.length > 0) {
			return result;
		}
	} catch (error) {
		log.warn('Admin Projects Query Error:', error);
	}

	return initialProjects;
}

export async function getProjectById(id: string): Promise<Project | null> {
	try {
		const result = await db
			.select()
			.from(projects)
			.where(eq(projects.id, id))
			.limit(1);

		if (result && result.length > 0) {
			return result[0];
		}
	} catch (error) {
		log.warn('Project By ID Query Error:', error);
	}

	return initialProjects.find((p) => p.id === id) || null;
}

export async function createProject(
	data: Omit<NewProject, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<Project> {
	const [inserted] = await db.insert(projects).values(data).returning();
	return inserted;
}

export async function updateProject(id: string, data: Partial<NewProject>): Promise<Project | null> {
	const [updated] = await db
		.update(projects)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(projects.id, id))
		.returning();
	return updated || null;
}

export async function deleteProject(id: string): Promise<boolean> {
	const [deleted] = await db
		.delete(projects)
		.where(eq(projects.id, id))
		.returning({ id: projects.id });
	return !!deleted;
}

export async function toggleProjectPublished(id: string): Promise<Project | null> {
	const current = await getProjectById(id);
	if (!current) return null;

	const [updated] = await db
		.update(projects)
		.set({ isPublished: !current.isPublished, updatedAt: new Date() })
		.where(eq(projects.id, id))
		.returning();
	return updated || null;
}

export async function reorderProject(id: string, direction: 'up' | 'down'): Promise<boolean> {
	try {
		await seedProjectsIfEmpty();

		const all = await db
			.select()
			.from(projects)
			.orderBy(asc(projects.orderIndex), desc(projects.createdAt));

		const index = all.findIndex((p) => p.id === id);
		if (index === -1) return false;

		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= all.length) return true;

		const reordered = [...all];
		const [moved] = reordered.splice(index, 1);
		reordered.splice(targetIndex, 0, moved);

		await db.transaction(async (tx) => {
			for (let i = 0; i < reordered.length; i++) {
				const p = reordered[i];
				const newOrder = i + 1;
				if (p.orderIndex !== newOrder) {
					await tx
						.update(projects)
						.set({ orderIndex: newOrder, updatedAt: new Date() })
						.where(eq(projects.id, p.id));
				}
			}
		});

		log.info(`Reordered project ${id} ${direction} (from pos ${index + 1} to ${targetIndex + 1})`);
		return true;
	} catch (error) {
		log.warn('Reorder Project Error:', error);
		return false;
	}
}
