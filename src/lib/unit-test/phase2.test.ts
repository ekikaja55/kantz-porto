import { describe, it, expect } from 'vitest';
import { en } from '../i18n/en';
import { id } from '../i18n/id';
import { i18n } from '../i18n/index.svelte';
import { performanceStore } from '../stores/performance.svelte';
import { setMode, resetMode } from 'mode-watcher';

describe('Phase 2: i18n Dictionaries & Parity', () => {
	it('has matching top-level keys in both en and id dictionaries', () => {
		const enKeys = Object.keys(en).sort();
		const idKeys = Object.keys(id).sort();
		expect(enKeys).toEqual(idKeys);
	});

	it('has matching nested keys across all sections', () => {
		for (const section of Object.keys(en) as (keyof typeof en)[]) {
			const enSubKeys = Object.keys(en[section]).sort();
			const idSubKeys = Object.keys(id[section]).sort();
			expect(enSubKeys).toEqual(idSubKeys);
		}
	});

	it('toggles language and returns correct localized strings', () => {
		i18n.setLanguage('en');
		expect(i18n.lang).toBe('en');
		expect(i18n.t.nav.home).toBe('Home');

		i18n.toggleLanguage();
		expect(i18n.lang).toBe('id');
		expect(i18n.t.nav.home).toBe('Beranda');

		i18n.setLanguage('en');
		expect(i18n.lang).toBe('en');
	});
});

describe('Phase 2: Theme Management & Performance Mode Store', () => {
	it('has expected performance mode store state properties', () => {
		expect(typeof performanceStore.performanceMode).toBe('boolean');
	});

	it('toggles performance mode properly', () => {
		const initial = performanceStore.performanceMode;
		performanceStore.toggle();
		expect(performanceStore.performanceMode).toBe(!initial);
		performanceStore.set(initial);
		expect(performanceStore.performanceMode).toBe(initial);
	});

	it('provides mode-watcher control functions', () => {
		expect(typeof setMode).toBe('function');
		expect(typeof resetMode).toBe('function');
	});
});
