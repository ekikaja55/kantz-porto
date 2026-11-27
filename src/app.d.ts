import type { User, Session } from 'better-auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	const __APP_VERSION__: string;
	const __COMMIT__: string;
	const __BUILD_DATE__: string;

	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
