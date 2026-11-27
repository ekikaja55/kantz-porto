import { untrack } from 'svelte';
import { setStatusMessage } from './status.svelte';

/**
 * Terminal Theme Store (moonfly | ayu)
 * Persists to localStorage key "kantz-theme" and updates <html data-term-theme>.
 * Uses the View Transitions API for a crisp radial chromatic wipe when supported.
 */

export type ThemeName = 'moonfly' | 'ayu';

export interface ThemeTransitionOrigin {
	x: number;
	y: number;
}

const STORAGE_KEY = 'kantz-theme';

let currentTheme = $state<ThemeName>('moonfly');

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function prefersReducedMotion(): boolean {
	return (
		typeof window !== 'undefined' &&
		typeof window.matchMedia === 'function' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

function applyThemeToDom(name: ThemeName): void {
	document.documentElement.setAttribute('data-term-theme', name);
	try {
		window.localStorage.setItem(STORAGE_KEY, name);
	} catch {
		// Ignore private browsing storage errors
	}
}

export function isThemeName(value: string): value is ThemeName {
	return value === 'ayu' || value === 'moonfly';
}

export function initTheme(): void {
	if (!isBrowser()) return;
	untrack(() => {
		const attr = document.documentElement.getAttribute('data-term-theme');
		if (attr && isThemeName(attr)) {
			currentTheme = attr;
			return;
		}
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored && isThemeName(stored)) {
				currentTheme = stored;
				document.documentElement.setAttribute('data-term-theme', stored);
			}
		} catch {
			// Ignore private browsing storage errors
		}
	});
}

export function getTheme(): ThemeName {
	return currentTheme;
}

export function setTheme(
	name: ThemeName,
	announce = true,
	origin?: ThemeTransitionOrigin
): ThemeName {
	untrack(() => {
		const changed = currentTheme !== name;
		currentTheme = name;

		if (isBrowser()) {
			const doc = document as Document & {
				startViewTransition?: (callback: () => void) => { finished: Promise<void> };
			};

			if (changed && typeof doc.startViewTransition === 'function' && !prefersReducedMotion()) {
				const root = document.documentElement;
				if (origin) {
					root.style.setProperty('--vt-x', `${Math.round(origin.x)}px`);
					root.style.setProperty('--vt-y', `${Math.round(origin.y)}px`);
				} else {
					root.style.setProperty('--vt-x', '90%');
					root.style.setProperty('--vt-y', '95%');
				}
				root.classList.add('term-theme-transition');

				try {
					const transition = doc.startViewTransition(() => {
						applyThemeToDom(name);
					});
					transition.finished.finally(() => {
						root.classList.remove('term-theme-transition');
					});
				} catch {
					root.classList.remove('term-theme-transition');
					applyThemeToDom(name);
				}
			} else {
				applyThemeToDom(name);
			}
		}

		if (announce) {
			setStatusMessage(`theme: ${name}`);
		}
	});
	return name;
}

export function toggleTheme(announce = true, origin?: ThemeTransitionOrigin): ThemeName {
	const next: ThemeName = currentTheme === 'moonfly' ? 'ayu' : 'moonfly';
	return setTheme(next, announce, origin);
}
