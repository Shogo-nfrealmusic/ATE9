export type HeroContent = {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaLink: string;
  imageUrl: string;
};

export type ServiceItem = {
  id: string;
  /**
   * `/services/[slug]` で利用する一意な識別子。
   * 英小文字とハイフンのみを推奨。
   */
  slug: string;
  title: string;
  description: string;
  backgroundColor: string;
  gallery: string[];
};

export type ServicesContent = {
  intro: string;
  items: ServiceItem[];
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  /**
   * 任意の外部サイトリンク。指定されていない場合は表示しない。
   */
  linkUrl?: string;
  /**
   * 関連するサービス ID（`ServiceItem.id`）。サービス詳細ページでフィルタリングに使用する。
   */
  serviceId?: string | null;
};

export type PortfolioContent = {
  heading: string;
  subheading: string;
  items: PortfolioItem[];
};

export type BrandPhilosophyStructureItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  subDescription?: string;
};

export type BrandPhilosophySummaryItem = {
  id: string;
  label: string;
  title: string;
  description: string;
};

export type BrandPhilosophyClosingPart = {
  id: string;
  text: string;
  /**
   * 表示時のスタイル
   * - default: 通常テキスト
   * - primary: 強調 (白太字)
   * - accent: アクセントカラー
   */
  variant?: 'default' | 'primary' | 'accent';
};

export type BrandPhilosophyContent = {
  heading: string;
  subheading: string;
  introHeading: string;
  introParagraphs: string[];
  structureLabel: string;
  structureDescription: string;
  structureItems: BrandPhilosophyStructureItem[];
  closingTitle: string;
  closingDescriptionParts: BrandPhilosophyClosingPart[];
  summaryLabel: string;
  summaryDescription: string;
  summarySupportingText: string;
  summaryItemsLabel: string;
  summaryItems: BrandPhilosophySummaryItem[];
  coreValuesLabel: string;
  coreValues: string[];
};

export type AboutContent = {
  heading: string;
  description: string;
};

export type LandingContent = {
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  brandPhilosophy: BrandPhilosophyContent;
};
