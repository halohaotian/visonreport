import 'server-only';

const dictionaries = {
  en: () => import('./en.json').then((m) => m.default),
  zh: () => import('./zh.json').then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = 'en';

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
