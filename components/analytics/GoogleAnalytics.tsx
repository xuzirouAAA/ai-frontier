'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function trackPageview(pathname: string) {
  if (!GA_ID || typeof window === 'undefined') return;

  try {
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.(
      'config',
      GA_ID,
      { page_path: pathname }
    );
  } catch {
    // 静默失败
  }
}

function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (GA_ID) {
      trackPageview(pathname);
    }
  }, [pathname]);

  return null;
}

/**
 * Google Analytics 组件
 * 在根布局中加载，自动追踪页面访问
 *
 * 环境变量: NEXT_PUBLIC_GA_ID (如 G-XXXXXXXXXX)
 * 未配置时自动跳过，不会加载任何脚本
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
