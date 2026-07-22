'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Google AdSense 广告位组件
 *
 * 使用方式:
 * <AdSlot slot="1234567890" format="horizontal" />
 *
 * slot ID 需在 Google AdSense 后台创建广告单元后获取。
 * 在开发环境中，广告位显示为占位符。
 */
export default function AdSlot({ slot, format = 'auto', className = '', style }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isDev = process.env.NODE_ENV === 'development';
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // 不重复加载
    if (isDev || !adsenseId || !adRef.current) return;

    try {
      // 防止重复推送
      if (adRef.current.querySelector('.adsbygoogle[data-ad-status="loaded"]')) return;

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.dataset.adClient = adsenseId;
      ins.dataset.adSlot = slot;
      ins.dataset.adFormat = format;
      ins.dataset.fullWidthResponsive = 'true';

      adRef.current.innerHTML = '';
      adRef.current.appendChild(ins);

      // 异步推送广告
      const pushAd = () => {
        try {
          const g = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle;
          if (g) {
            g.push({});
          }
        } catch {
          // 静默处理广告拦截器
        }
      };

      // 等待 AdSense 脚本加载
      if (document.querySelector('script[src*="adsbygoogle.js"]')) {
        pushAd();
      } else {
        const checkScript = setInterval(() => {
          if (document.querySelector('script[src*="adsbygoogle.js"]')) {
            clearInterval(checkScript);
            pushAd();
          }
        }, 500);
        setTimeout(() => clearInterval(checkScript), 10000);
      }
    } catch {
      // 静默失败
    }
  }, [slot, format, adsenseId, isDev]);

  // 开发环境或未配置 AdSense ID 时显示占位符
  if (isDev || !adsenseId) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
        style={{ minHeight: format === 'horizontal' ? 90 : format === 'rectangle' ? 250 : 90, ...style }}
      >
        <div className="text-center">
          <svg className="mx-auto mb-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span className="text-xs">广告位</span>
        </div>
      </div>
    );
  }

  return <div ref={adRef} className={className} style={style} />;
}
