/**
 * Supported locales
 */
export const LOCALES = ['zh', 'en', 'ja', 'ko', 'zh-TW'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Maps browser language codes to our supported locales
 */
const LANG_MAP: Record<string, Locale> = {
  'zh': 'zh',
  'zh-CN': 'zh',
  'zh-Hans': 'zh',
  'zh-TW': 'zh-TW',
  'zh-Hant': 'zh-TW',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'ja': 'ja',
  'ja-JP': 'ja',
  'ko': 'ko',
  'ko-KR': 'ko',
};

/**
 * Detect locale from browser Accept-Language header (server component only).
 * Falls back to 'zh' if no match found.
 */
export function detectLocale(headerValue?: string): Locale {
  if (!headerValue) return 'zh';
  const firstLang = headerValue.split(',')[0].trim().split(';')[0].trim().toLowerCase();
  const mapped = LANG_MAP[firstLang];
  if (mapped) return mapped;
  const prefix = firstLang.slice(0, 2);
  return LANG_MAP[prefix] ?? 'zh';
}

/**
 * Get the locale from cookies (for use in client components via SSR).
 */
export function getLocaleFromCookie(cookiesStr: string | null): Locale {
  if (!cookiesStr) return 'zh';
  const match = cookiesStr.match(/(?:^|;\s*)locale=([^;]*)/);
  if (match && match[1] && LOCALES.includes(match[1] as Locale)) {
    return match[1] as Locale;
  }
  return 'zh';
}

/**
 * Get HTML lang attribute for a locale
 */
export function getLangAttr(locale: Locale): string {
  const map: Record<Locale, string> = {
    zh: 'zh-CN',
    'zh-TW': 'zh-TW',
    en: 'en-US',
    ja: 'ja-JP',
    ko: 'ko-KR',
  };
  return map[locale];
}

/**
 * All supported locale codes for <html lang> and SEO alternates
 */
export const ALL_LOCALES: { locale: Locale; code: string; name: string }[] = [
  { locale: 'zh',   code: 'zh-CN', name: '简体中文' },
  { locale: 'en',   code: 'en-US', name: 'English' },
  { locale: 'ja',   code: 'ja-JP', name: '日本語' },
  { locale: 'ko',   code: 'ko-KR', name: '한국어' },
  { locale: 'zh-TW',code: 'zh-TW', name: '繁體中文' },
];
