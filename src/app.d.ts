import type { User, Session } from 'better-auth';
import type { Language } from '#lib/i18n';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
			lang?: Language;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
