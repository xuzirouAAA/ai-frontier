import Link from 'next/link';
import { CATEGORIES } from '@/data/site';
import { useI18n } from '@/components/i18n/LocaleProvider';

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              {t('common.siteName')}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              {t('footer.siteDesc')}
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              {t('footer.categoriesTitle')}
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.filter((c) => c.slug !== 'calculator').map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/tools/category/${cat.slug}`}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                  >
                    {t(`nav.categories.${cat.slug}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              {t('footer.aboutTitle')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('pages.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/author"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('pages.author')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('pages.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('pages.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  {t('pages.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          <p>{t('footer.disclaimer')}</p>
          <p className="mt-2">&copy; {year} {t('common.siteName')}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
