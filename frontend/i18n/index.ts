import en from './en';
import am from './am';
import or from './or';
import type { TranslationKeys } from './en';
import type { Locale, LocaleOption } from '@/types';

export const translations: Record<Locale, TranslationKeys> = { en, am, or };

export const localeOptions: LocaleOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'or', name: 'Oromiffa', nativeName: 'Afaan Oromoo', flag: '🇪🇹' },
];

export const defaultLocale: Locale = 'en';

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale] || translations[defaultLocale];
}

// Helper to get nested translation value with dot notation
export function t(translations: TranslationKeys, path: string, replacements?: Record<string, string | number>): string {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = translations;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return path;
  }
  if (typeof result !== 'string') return path;
  if (replacements) {
    return Object.entries(replacements).reduce(
      (str, [key, val]) => str.replace(`{${key}}`, String(val)),
      result
    );
  }
  return result;
}
