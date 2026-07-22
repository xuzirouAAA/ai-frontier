'use client';

import { useEffect, useState } from 'react';
import AdSlot from './AdSlot';

interface InContentAdProps {
  paragraphIndex: number;
  injectEvery?: number;  // 每隔多少段落插入一次广告
  slot?: string;
}

/**
 * 内容流内广告组件
 * 在文章段落之间智能插入广告
 *
 * 使用方式: 放到 ArticleContent 中，根据段落索引决定是否显示
 */
export default function InContentAd({
  paragraphIndex,
  injectEvery = 4,
  slot = 'in-content',
}: InContentAdProps) {
  // 只在指定段落后显示广告（避免开头就出现广告）
  const shouldShow = paragraphIndex > 1 && paragraphIndex % injectEvery === 0;

  if (!shouldShow) return null;

  return (
    <div className="my-8">
      <AdSlot slot={slot} format="auto" className="min-h-[90px]" />
      <p className="mt-1 text-center text-[10px] text-zinc-400">广告声明</p>
    </div>
  );
}
