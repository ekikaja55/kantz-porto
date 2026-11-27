import { pgTable, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const projects = pgTable(
	'projects',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		slug: text('slug').notNull().unique(),
		title: text('title').notNull(),
		tagline: text('tagline').notNull(),
		description: text('description').notNull(),
		category: text('category').notNull().default('web'),
		tier: integer('tier').notNull().default(2),
		status: text('status').notNull().default('live'),
		technologies: text('technologies').array().notNull().default([]),
		images: text('images').array().notNull().default([]),
		liveUrl: text('live_url'),
		githubUrl: text('github_url'),
		thumbnailUrl: text('thumbnail_url'),
		orderIndex: integer('order_index').notNull().default(0),
		isPublished: boolean('is_published').notNull().default(true),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index('projects_published_order_idx').on(table.isPublished, table.orderIndex),
		index('projects_featured_idx').on(table.isPublished, table.tier, table.orderIndex)
	]
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const skills = pgTable(
	'skills',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		category: text('category').notNull(), // 'languages' | 'frameworks' | 'databases' | 'systems'
		name: text('name').notNull(),
		orderIndex: integer('order_index').notNull().default(0),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('skills_order_idx').on(table.orderIndex)]
);

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export const experiences = pgTable(
	'experiences',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		period: text('period').notNull(),
		company: text('company').notNull(),
		role: text('role').notNull(),
		description: text('description').notNull(),
		highlights: text('highlights').array().notNull().default([]),
		orderIndex: integer('order_index').notNull().default(0),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('experiences_order_idx').on(table.orderIndex)]
);

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export * from './auth.schema';
