import { db } from './db';
import { user, account } from './db/schema';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '$app/env/private';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import { createLogger } from '#lib/utils/logger.ts';

const log = createLogger('AuthSeed');

export async function ensureAdminUser() {
	if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
		return { seeded: false, message: 'ADMIN_EMAIL or ADMIN_PASSWORD not configured' };
	}

	try {
		const existingUser = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, ADMIN_EMAIL))
			.limit(1);

		if (existingUser.length > 0) {
			log.debug('Admin user already exists in database');
			return { seeded: false, message: 'Admin user already exists' };
		}

		const userId = crypto.randomUUID();
		const hashedPassword = await hashPassword(ADMIN_PASSWORD);

		await db.insert(user).values({
			id: userId,
			name: 'Rizki Arkant Pratama',
			email: ADMIN_EMAIL,
			emailVerified: true
		});

		await db.insert(account).values({
			id: crypto.randomUUID(),
			accountId: userId,
			providerId: 'credential',
			userId: userId,
			password: hashedPassword
		});

		log.info(`Admin user created and seeded: ${ADMIN_EMAIL}`);
		return { seeded: true, message: `Admin user seeded: ${ADMIN_EMAIL}` };
	} catch (error) {
		log.warn('Note on admin user seeding:', error instanceof Error ? error.message : error);
		return { seeded: false, message: 'Error or bypass during admin seeding' };
	}
}
