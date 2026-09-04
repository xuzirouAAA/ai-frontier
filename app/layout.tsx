import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/data/site';
import { buildOrganizationSchema, renderJsonLd } from '@/lib/json-ld';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { I18nProvider } from '@/components/i18n/LocaleProvider';
import { detectLocale, LOCALES, Locale, ALL_LOCALES, getLangAttr } from '@/lib/i18n/detect';
import './globals.css';

async function getLocale(): Promise<Locale> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get('locale')?.value;
  if (cookieVal && LOCALES.includes(cookieVal as Locale)) {
    return cookieVal as Locale;
  }
  return detectLocale();
}

const langAttrMap: Record<Locale, string> = {
  zh: 'zh-CN',
  'zh-TW': 'zh-TW',
  en: 'en-US',
  ja: 'ja-JP',
  ko: 'ko-KR',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const langAttr = langAttrMap[locale];
  const orgSchema = buildOrganizationSchema();
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang={langAttr} className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(orgSchema) }}
        />
        <meta name="google-site-verification" content="googleb6fec2980f7af787" />
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-full flex-col bg-white dark:bg-zinc-950">
        <I18nProvider locale={locale}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
