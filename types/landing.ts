export type LocalizedText = {
  ja: string;
  en: string;
};

export type HeroContent = {
  heading: LocalizedText;
  subheading: LocalizedText;
  ctaLabel: LocalizedText;
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
  title: LocalizedText;
  description: LocalizedText;
  backgroundColor: string;
  gallery: string[];
};

export type ServicesContent = {
  intro: LocalizedText;
  items: ServiceItem[];
};

export type PortfolioItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  /**
   * 任意の外部サイトリンク。指定されていない場合は表示しない。
   */
  linkUrl?: string;
  /**
   * 関連するサービス ID（`ServiceItem.id`）。サービス詳細ページでフィルタリングに使用する。
   */
  serviceId: string | null;
};

export type PortfolioContent = {
  heading: LocalizedText;
  subheading: LocalizedText;
  items: PortfolioItem[];
};

export type BrandPhilosophyStructureItem = {
  id: string;
  label: string;
  title: LocalizedText;
  description: LocalizedText;
  subDescription?: LocalizedText;
};

export type BrandPhilosophySummaryItem = {
  id: string;
  label: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type BrandPhilosophyClosingPart = {
  id: string;
  text: LocalizedText;
  /**
   * 表示時のスタイル
   * - default: 通常テキスト
   * - primary: 強調 (白太字)
   * - accent: アクセントカラー
   */
  variant?: 'default' | 'primary' | 'accent';
};

export type BrandPhilosophyContent = {
  heading: LocalizedText;
  subheading: LocalizedText;
  introHeading: LocalizedText;
  introParagraphs: LocalizedText[];
  structureLabel: LocalizedText;
  structureDescription: LocalizedText;
  structureItems: BrandPhilosophyStructureItem[];
  closingTitle: LocalizedText;
  closingDescriptionParts: BrandPhilosophyClosingPart[];
  summaryLabel: LocalizedText;
  summaryDescription: LocalizedText;
  summarySupportingText: LocalizedText;
  summaryItemsLabel: LocalizedText;
  summaryItems: BrandPhilosophySummaryItem[];
  coreValuesLabel: LocalizedText;
  coreValues: LocalizedText[];
};

export type AboutContent = {
  heading: LocalizedText;
  description: LocalizedText;
};

export type LandingContent = {
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  brandPhilosophy: BrandPhilosophyContent;
};
