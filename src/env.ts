import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.' },
	ORIGIN: {
		description: 'The app origin (base URL), e.g. `http://localhost:5173`.'
	},
	BETTER_AUTH_SECRET: {
		description: 'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
	},
	ADMIN_EMAIL: {
		description: 'Initial admin email address for CMS seeding.'
	},
	ADMIN_PASSWORD: {
		description: 'Initial admin password for CMS seeding.'
	},
	UPSTASH_REDIS_REST_URL: {
		description: 'Upstash Redis REST endpoint.'
	},
	UPSTASH_REDIS_REST_TOKEN: {
		description: 'Upstash Redis REST token.'
	},
	PUBLIC_SUPABASE_URL: {
		description: 'Supabase project base URL for client and storage.',
		required: false
	},
	PUBLIC_SUPABASE_ANON_KEY: {
		description: 'Supabase anonymous/public key.',
		required: false
	}
});
