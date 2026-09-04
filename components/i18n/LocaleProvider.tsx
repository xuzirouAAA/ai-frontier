'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LOCALES, Locale, getLangAttr } from '@/lib/i18n/detect';
import { tStr } from '@/lib/i18n/messages';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string, vars?: Record<string, string | number>) => string;
  langAttr: string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Preload all message bundles at module load time
const MESSAGE_BUNDLES: Record<Locale, Record<string, unknown>> = {} as Record<Locale, Record<string, unknown>>;

function loadMessages(locale: Locale): Record<string, unknown> {
  if (MESSAGE_BUNDLES[locale]) return MESSAGE_BUNDLES[locale];
  try {
    const mod = require(`@/messages/${locale}.json`) as { default: Record<string, unknown> };
    MESSAGE_BUNDLES[locale] = mod.default;
    return mod.default;
  } catch {
    try {
      const mod = require(`@/messages/zh.json`) as { default: Record<string, unknown> };
      MESSAGE_BUNDLES['zh'] = mod.default;
      return mod.default;
    } catch {
      return {};
    }
  }
}

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);

  // Initialize all bundles on first render
  useState(() => {
    for (const loc of LOCALES) {
      try {
        const mod = require(`@/messages/${loc}.json`) as { default: Record<string, unknown> };
        MESSAGE_BUNDLES[loc] = mod.default;
      } catch {
        // skip unavailable locale
      }
    }
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setCurrentLocale(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
  }, []);

  const t = useCallback(
    (key: string, fallback?: string, vars?: Record<string, string | number>): string => {
      const msgs = loadMessages(currentLocale);
      const parts = key.split('.');
      let val: unknown = msgs;
      for (const part of parts) {
        if (val && typeof val === 'object') {
          val = (val as Record<string, unknown>)[part];
        } else {
          val = undefined;
          break;
        }
      }
      if (typeof val === 'string') {
        return tStr(val, vars);
      }
      return fallback ?? key;
    },
    [currentLocale],
  );

  return (
    <I18nContext.Provider
      value={{
        locale: currentLocale,
        setLocale,
        t,
        langAttr: getLangAttr(currentLocale),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
