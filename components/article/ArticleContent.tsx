import type { ContentBlock } from '@/types/article';
import type { Article } from '@/types/article';
import AffiliateLink from '@/components/affiliate/AffiliateLink';

interface ArticleContentProps {
  content: ContentBlock[];
  affiliateProducts?: string[];
}

function renderBlock(block: ContentBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'heading':
      const HeadingTag = block.level === 3 ? 'h3' : 'h2';
      const headingClass = block.level === 3
        ? 'mt-6 mb-3 text-xl font-semibold text-zinc-900 dark:text-white'
        : 'mt-8 mb-4 text-2xl font-bold text-zinc-900 dark:text-white';
      return (
        <HeadingTag key={index} className={headingClass}>
          {block.text}
        </HeadingTag>
      );

    case 'paragraph':
      return (
        <p key={index} className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
          {block.text}
        </p>
      );

    case 'list':
      return (
        <ul key={index} className="mb-4 list-inside list-disc space-y-2 text-zinc-700 dark:text-zinc-300">
          {block.items?.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );

    case 'quote':
      return (
        <blockquote key={index} className="my-6 border-l-4 border-blue-500 bg-blue-50 py-3 pl-4 italic text-zinc-600 dark:border-blue-400 dark:bg-blue-950/50 dark:text-zinc-400">
          {block.text}
        </blockquote>
      );

    case 'code':
      return (
        <pre key={index} className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-100">
          <code>{block.text}</code>
        </pre>
      );

    case 'image':
      return (
        <figure key={index} className="my-6">
          <img
            src={block.src || ''}
            alt={block.alt || ''}
            className="w-full rounded-lg object-cover"
          />
          {block.alt && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500">{block.alt}</figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

export default function ArticleContent({ content, affiliateProducts }: ArticleContentProps) {
  const blocks: React.ReactNode[] = [];

  content.forEach((block, index) => {
    blocks.push(renderBlock(block, index));

    // Inject affiliate link after every 3rd paragraph
    if (affiliateProducts && affiliateProducts.length > 0 && block.type === 'paragraph') {
      const paragraphCount = content.slice(0, index + 1).filter((b) => b.type === 'paragraph').length;
      if (paragraphCount > 1 && paragraphCount % 2 === 0 && affiliateProducts.length > 0) {
        const productIdx = Math.floor(paragraphCount / 2) - 1;
        const productSlug = affiliateProducts[productIdx % affiliateProducts.length];
        if (productSlug) {
          blocks.push(
            <div key={`affiliate-${index}`} className="my-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <AffiliateLink productSlug={productSlug}>
                <span className="font-medium text-blue-700 hover:text-blue-500 dark:text-blue-400">
                  🔗 推荐工具：立即体验 →
                </span>
              </AffiliateLink>
            </div>
          );
        }
      }
    }
  });

  return <div className="prose-custom">{blocks}</div>;
}
