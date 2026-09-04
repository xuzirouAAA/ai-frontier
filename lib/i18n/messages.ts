import { LOCALES, Locale } from './detect';

const messagesCache = new Map<Locale, Record<string, unknown>>();

export async function getMessages(locale: Locale): Promise<Record<string, unknown>> {
  if (messagesCache.has(locale)) {
    return messagesCache.get(locale)!;
  }
  let mod: { default: Record<string, unknown> };
  try {
    mod = await import(`../../messages/${locale}.json`);
  } catch {
    // Fallback to zh
    mod = await import(`../../messages/zh.json`);
  }
  const msgs = mod.default as Record<string, unknown>;
  messagesCache.set(locale, msgs);
  return msgs;
}

export function getAllMessages(): Record<Locale, Record<string, unknown>> {
  const result: Partial<Record<Locale, Record<string, unknown>>> = {};
  for (const locale of LOCALES) {
    try {
      const mod = require(`../../messages/${locale}.json`) as { default: Record<string, unknown> };
      result[locale] = mod.default;
    } catch {
      // skip
    }
  }
  return result as Record<Locale, Record<string, unknown>>;
}

/**
 * Format an i18n string with variable substitution.
 * Supports {{key}} placeholders.
 */
export function tStr(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key];
    return val !== undefined ? String(val) : `{{${key}}}`;
  });
}
