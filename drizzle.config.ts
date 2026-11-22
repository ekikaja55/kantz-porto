import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Use port 5432 (session pooler / direct connection) for schema introspection & migrations
// to prevent PgBouncer transaction-mode multiplexing pipeline issues on port 6543.
const url = process.env.DATABASE_URL.replace(':6543', ':5432');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url },
	schemaFilter: ['public'],
	verbose: true,
	strict: true
});
