'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LOCALES, Locale, getLangAttr } from '@/lib/i18n/detect';
import { tStr } from '@/lib/i18n/messages';

// Statically import all message bundles at build time
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import koMessages from '@/messages/ko.json';
import zhTWMessages from '@/messages/zh-TW.json';

const MESSAGE_BUNDLES: Record<Locale, Record<string, unknown>> = {
  zh: zhMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
  ja: jaMessages as Record<string, unknown>,
  ko: koMessages as Record<string, unknown>,
  'zh-TW': zhTWMessages as Record<string, unknown>,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string, vars?: Record<string, string | number>) => string;
  langAttr: string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);

  const setLocale = useCallback((newLocale: Locale) => {
    setCurrentLocale(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
  }, []);

  const t = useCallback(
    (key: string, fallback?: string, vars?: Record<string, string | number>): string => {
      const msgs = MESSAGE_BUNDLES[currentLocale];
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
