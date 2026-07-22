import { getAffiliateUrl } from '@/lib/affiliate';

interface AffiliateLinkProps {
  productSlug: string;
  children: React.ReactNode;
  className?: string;
}

export default function AffiliateLink({ productSlug, children, className = '' }: AffiliateLinkProps) {
  const url = getAffiliateUrl(productSlug);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center gap-1 transition-colors hover:opacity-80 ${className}`}
    >
      {children}
    </a>
  );
}
