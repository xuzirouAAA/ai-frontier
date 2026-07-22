export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'quote' | 'code';
  level?: number;
  text?: string;
  src?: string;
  alt?: string;
  items?: string[];
  language?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  author: {
    name: string;
    avatar?: string;
  };
  featured: boolean;
  readingTime: number;
  content: ContentBlock[];
  affiliateProducts?: string[];
}
