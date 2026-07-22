import type { ContentBlock } from '@/types/article';
import TableOfContents from './TableOfContents';

interface ArticleSidebarProps {
  content: ContentBlock[];
}

export default function ArticleSidebar({ content }: ArticleSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <TableOfContents content={content} />
        {/* AdSense sidebar ad will go here in Phase 3 */}
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900">
          广告位
        </div>
      </div>
    </aside>
  );
}
