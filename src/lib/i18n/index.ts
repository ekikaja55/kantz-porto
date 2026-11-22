import { en, type TranslationDict } from './en';
import { id } from './id';

export type Language = 'en' | 'id';

export const dictionaries: Record<Language, TranslationDict> = {
	en,
	id
};

export function getDictionary(lang: Language): TranslationDict {
	return dictionaries[lang] || dictionaries.en;
}

export function t(lang: Language): TranslationDict {
	return getDictionary(lang);
}

export { en, id, type TranslationDict };
