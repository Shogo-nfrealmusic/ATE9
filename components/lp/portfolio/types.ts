import type { PortfolioItem } from '@/types/landing';

export type PortfolioItemForUI = Pick<
  PortfolioItem,
  'id' | 'title' | 'description' | 'imageUrl' | 'linkUrl'
>;
