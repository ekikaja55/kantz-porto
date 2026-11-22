import { browser } from '$app/env';
import { en, type TranslationDict } from './en';
import { id } from './id';

export type Language = 'en' | 'id';

const dictionaries: Record<Language, TranslationDict> = {
	en,
	id
};

class I18nStore {
	lang = $state<Language>('en');

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('kantz_lang') as Language;
			if (saved === 'en' || saved === 'id') {
				this.lang = saved;
			}
		}
	}

	setLanguage(newLang: Language) {
		this.lang = newLang;
		if (browser) {
			localStorage.setItem('kantz_lang', newLang);
			document.documentElement.lang = newLang;
		}
	}

	toggleLanguage() {
		this.setLanguage(this.lang === 'en' ? 'id' : 'en');
	}

	get t(): TranslationDict {
		return dictionaries[this.lang];
	}
}

export const i18n = new I18nStore();
export { en, id };
