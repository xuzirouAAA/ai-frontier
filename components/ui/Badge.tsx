import Link from 'next/link';

interface BadgeProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ href, children, className = '' }: BadgeProps) {
  const baseClass = `inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 ${className}`;

  if (href) {
    return <Link href={href} className={baseClass}>{children}</Link>;
  }
  return <span className={baseClass}>{children}</span>;
}
