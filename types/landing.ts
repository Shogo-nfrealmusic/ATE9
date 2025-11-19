export type HeroContent = {
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaLink: string;
  imageUrl: string;
};

export type ServiceItem = {
  id: string;
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
};

export type PortfolioContent = {
  heading: string;
  subheading: string;
  items: PortfolioItem[];
};

export type AboutContent = {
  heading: string;
  description: string;
};

export type MissionContent = {
  heading: string;
  description: string;
};

export type LandingContent = {
  hero: HeroContent;
  about: AboutContent;
  mission: MissionContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
};

