'use client';

import type { ContentBlock } from '@/types/article';
import { useState, useEffect } from 'react';

interface TableOfContentsProps {
  content: ContentBlock[];
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const headings = content.filter((b) => b.type === 'heading' && b.level === 2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach((h) => {
      const id = h.text?.toLowerCase().replace(/\s+/g, '-');
      const el = document.getElementById(id || '');
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">目录</h3>
      <ul className="space-y-1.5">
        {headings.map((h) => {
          const id = h.text?.toLowerCase().replace(/\s+/g, '-');
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block text-sm transition-colors ${
                  activeId === id
                    ? 'font-medium text-blue-600 dark:text-blue-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
