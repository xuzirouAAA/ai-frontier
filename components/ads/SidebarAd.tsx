import AdSlot from './AdSlot';

interface SidebarAdProps {
  slot?: string;
}

/**
 * 侧边栏广告组件（固定位置，随页面滚动）
 */
export default function SidebarAd({ slot = 'sidebar' }: SidebarAdProps) {
  return (
    <div className="sticky top-24">
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          赞助
        </h3>
        <AdSlot slot={slot} format="rectangle" className="min-h-[250px]" />
      </div>
    </div>
  );
}
