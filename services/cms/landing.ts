import { supabase } from "@/lib/supabase/client";
import type {
    AboutContent,
    HeroContent,
    LandingContent,
    MissionContent,
    PortfolioContent,
    PortfolioItem,
    ServiceItem,
    ServicesContent,
} from "@/types/landing";

const ROW_ID = "default";

const FALLBACK_CONTENT: LandingContent = {
  hero: {
    heading: "夢なんて願わない。俺たちは、喰らって叶える。",
    subheading:
      "We don't wish for dreams. We devour them to achieve them. ATE9 is a tribe of limit-breakers, a movement of challengers. We exist to break limits, feeding on dreams and turning them into flesh and blood to move the world.",
    ctaLabel: "Contact",
    ctaLink: "#contact",
    imageUrl: "",
  },
  about: {
    heading: "ATE9 は会社ではない。挑戦者の\"家\"だ。",
    description:
      "ATE9 is not a company. It's a \"HOME\" for challengers. A is for Ace, T is for Top, E is for Evolve, Elevate, and Empower. The '9' represents the limits we are destined to devour, pushing beyond what's possible to redefine reality itself.",
  },
  mission: {
    heading: "俺たちは限界を壊すために存在する。夢をエサにし、血肉に変え、世界を動かす。",
    description:
      "ATE9 is not a \"company,\" but a \"movement\" that evolves, elevates, and empowers its companions.",
  },
  services: {
    intro:
      "We are a full-service creative agency specializing in visual content, motion graphics, and interactive experiences for the digital age.",
    items: [
      {
        id: "creative-production",
        title: "Creative Production & Visual Design",
        description:
          "We are a full-service creative agency specializing in visual content, motion graphics, and interactive experiences for the digital age. Elevate your brand with our innovative solutions.",
        backgroundColor: "#F2426D",
        gallery: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAxr-8iBAHDhLLfZuVWOXQvRI3RkD5YQeqsi6_ZKE076VGl29r-QyfJOMoZyvPvoAfuhzxU-3Ti0Qf_wnPSvffSU09iBmwZFuLIMpSMtOxrDMWkRj4qMZjFb5Sa3gKRrzOq3_n3GIhZUmVRul5ypCQBYpBnepXJrWB3ew9KHurAYKllqc949T8fluPQHVN3mCjIxTcRXp17kOweHwSMAh5VP2sQABUvv1k1W6CGo1fd-DJE7_YnST7Cq6i35N5UR3EkIc9SQfmSVNo",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDcIgelrIJrVYREYU3mJWRQoN0k5l6xI69V-zUbhU7galVQISVb2SDTvYU8nddUD72cbh5f_i-dRfy91G86bKDr7y9dVprvu0bQ2CPvwLceE5A2fyqwwW6beLkV-oFzGbQ8J_tjR20nuiTnzIgVwXwNsOX4ZCm3C4P8JdrGYk4bt2b6k6MEkuypriTg9p5OIkrrhvEfoPNg29xOwm5lj0Xzma9TNQ4DUv4dh3Rblkkbqw9ehIWFi4FK_rbF0FAdOzwPF49VRTxirBw",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBFjoonk0jREp72pVriB1yhJ-iqPtPIXBEacYNDL_F53CHi3SCRhkpnvmVvJFxD13MNSqclmjWf5k7VYwFsGgksYFdWeys0iAmmYK2tMg9C_TSW-8LQIsajWn6HkLFOMpMEjQj1eWsJQxUONNoZNuCNKKK4hyviEZYd_nVNJKmXM29vbiL9AniUEyCbVeZthACstlgfT6vC9rWT2ZWLScl_hhqXHGGjT4ERw9MU5ISu43cQL4JA-tASQPDjNNHGXXKgwt3ovzGj94g",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBWKKb5kw2yetwFRWdhetRLJ-7VIJCe3l-vw-yJrMbpzPeAFKr3Ik_eZ1taKrWGuUHAz_p5GoWOM_Na_x8E3VcuQZ9qrqM6JWjknPpPvRP96Zve4ORuERmWiQ-rDuQ7lYP5dxk_iMTR31UHt4ykyk4OUhxPIJdR-2judYI-VcTwZZs1zFMzqfxgubJhsfkkuWLGJBuKPia_MeZx-qvklRYLU5X4gmTC9gnpB-4J-8YvoT4qjHx4PY3O9Ga4AWUmdAMTUinpBLU08B0",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCO8_KIs8EFWw_n33CJy5lU0M_oFB0FkPt6FXXuhPBck2xZiN3I2hCCmxZfwRNrKyv8jaOOjvMYVDsa7u-qwHgQP7X_HeJ87HjjB_hG31QTcAPnkRCZr41cMJy1rCXX4JpL4HMqyDISIgDydxXX-Ng27tfqV0X0Aapi491LkbUu7Qp__Lt5J4O5VpU1xpg5Gqrk-mhfJ73dwEWYjuoMvncz1hCA-Q87tTi2SEbJ4fOeDygB5agTD3YBhsQrqqwRZPHonWs2ZqTxSRA",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCE8Ve0YVmiswa622qUip7Ng2zUDhAq6Hiq9hpH8bD6dObkVMRRUDH0UAz7gCJhnqjyL6hZD1ao8wUizxfrzn1VJkgD5i7vFSRGz9_26k7VJ5EG9NGip_oCaoZmLY_YijJUwTnwXC872KO7opPfn0UvEQ7qJ-k7cjpeSIA1OmwMYvsOinsljUhwO5O1cQn5t49CX5f7RaHWCTlqIWGWFCpjUNZ2B3hnG_vWm7hhaHFJ4pPbEticjiiXBrK8h9WB3k6UkdACf4_cT64",
        ],
      },
      {
        id: "brand-strategy",
        title: "Brand Strategy & Identity",
        description:
          "We help businesses build strong, memorable brands that resonate with their target audience. From logo design to comprehensive brand guidelines, we create cohesive visual identities.",
        backgroundColor: "#E4EEFA",
        gallery: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDcIgelrIJrVYREYU3mJWRQoN0k5l6xI69V-zUbhU7galVQISVb2SDTvYU8nddUD72cbh5f_i-dRfy91G86bKDr7y9dVprvu0bQ2CPvwLceE5A2fyqwwW6beLkV-oFzGbQ8J_tjR20nuiTnzIgVwXwNsOX4ZCm3C4P8JdrGYk4bt2b6k6MEkuypriTg9p5OIkrrhvEfoPNg29xOwm5lj0Xzma9TNQ4DUv4dh3Rblkkbqw9ehIWFi4FK_rbF0FAdOzwPF49VRTxirBw",
        ],
      },
      {
        id: "digital-experience",
        title: "Digital Experience Design",
        description:
          "Creating intuitive and engaging digital experiences that users love. We combine user research, design thinking, and cutting-edge technology to deliver exceptional results.",
        backgroundColor: "#F0F5FF",
        gallery: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBFjoonk0jREp72pVriB1yhJ-iqPtPIXBEacYNDL_F53CHi3SCRhkpnvmVvJFxD13MNSqclmjWf5k7VYwFsGgksYFdWeys0iAmmYK2tMg9C_TSW-8LQIsajWn6HkLFOMpMEjQj1eWsJQxUONNoZNuCNKKK4hyviEZYd_nVNJKmXM29vbiL9AniUEyCbVeZthACstlgfT6vC9rWT2ZWLScl_hhqXHGGjT4ERw9MU5ISu43cQL4JA-tASQPDjNNHGXXKgwt3ovzGj94g",
        ],
      },
    ],
  },
  portfolio: {
    heading: "Our Portfolio",
    subheading:
      "A curated selection of our past work. See how we've helped businesses like yours succeed.",
    items: [
      {
        id: "fintech",
        title: "Fintech Platform",
        description:
          "A comprehensive UI/UX redesign for a leading financial services provider.",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCQQzM5R243n-aMSc-RmkjKvsF2m_DhSg7q82ekuKRJSy5Dou9eUcyRhQXwHFyRmDtV0WJvtopMpBV41j5CvoaOFVf-qdU6z3clYAa5hsEAZx5rEAilLN2DWdra3PzHFGykTUueS0dnvLpTVKg94MPRbb7pRLk57u35mmLZAtOtF5_xZNrfeqDtV8am8Lt0-MJdoy9jv3o9ezRFwsqpSRXuahQXsY5krHBfQsm67HprJ1WiZAQO-i0GLvaaaCrusVset95Md4qx9aw",
        linkUrl: "https://example.com/fintech",
      },
      {
        id: "ecommerce",
        title: "E-commerce App",
        description:
          "Developed a high-conversion mobile shopping experience from the ground up.",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB-TYs9oD4RQ3n-jAcoiJxNaKs6wtAnvoIN9f4L5B-W2tFjqEe73lOyhotHKjc7xxlhcuevgWLP5urL0dJZbaxlRQ9VaUmbuvjztMFgO66AP2Mx49vTa5Mqn9ghUxi73KQZM9SAN_F1wEz6zD5737IylAR2CPCtX9_unGGp74WdT9TjdfEd5atDrVu1y5yXaZsYjUkd7N8VNRwxqtMGB5exXmh3rlmbXVv3lcqZhXJRZgdfvQdFskObRkcpOc533lijd84K-FCpJwE",
        linkUrl: "https://example.com/ecommerce",
      },
      {
        id: "wellness",
        title: "Wellness Tracker",
        description:
          "Designed and built a mobile app for tracking fitness goals and mental well-being.",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXa5ktZu8QhgmqHmDpad-6M9xivpINd8m1P7Ll04ZGMKrBOwW2n9k6IYPfPmqD37xxezRVeeyhWzuyYTkdQRKxJ5o-9sFHSsg13oeOily1p5mgeDC_OGbhBUbfN1OwAH8Rp-jTqy5stb0O9yHFKahvie9Env96k1UJt78WsZTFBNsjk8sUbIwtbJ9gOJcj87L92lKMMQpBjJodp4-iQGFyLn_TS70acEIIP9Kx2fNtyxAyxeOmZ_RszWJ0AzhoSupXKnnyzhBm5g",
        linkUrl: "https://example.com/wellness",
      },
      {
        id: "saas",
        title: "SaaS Dashboard",
        description:
          "An intuitive analytics dashboard for a B2B software-as-a-service company.",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAXeBO2MBk93DK4vLoTfhTYFvnbdBx-aZoC0kL9Sx_aYwo0wLQL5dAE1H2vb_XInCF0KmX_0NX5sxxhsumO4y6elxydzDJQoZ4YKhjFZ7UyadsP7IygOWFIeN3hxLF3XOXjz-g4gsMhIY_TYwCexdr3qT194-W9ovd4OBNbm-KIgN8VxpFEwVKkv54jOKWv7SQzWH6fK1atqBp_Nsd2iIj1NLzI5jkU0cO1vDkDlNliWXiVLjpBWarRwEjQxHbjpdcSdb6FFu0lMfg",
        linkUrl: "https://example.com/saas",
      },
    ],
  },
};

type HeroRow = {
  heading: string;
  subheading: string;
  cta_label: string;
  cta_link: string;
  image_url: string;
};

type ServiceRow = {
  intro: string;
};

type ServiceItemRow = {
  id: string;
  title: string;
  description: string;
  background_color: string;
  gallery: string[] | null;
  sort_order: number;
};

type PortfolioRow = {
  heading: string;
  subheading: string;
};

type PortfolioItemRow = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
};

type ContentRow = {
  content: {
    about?: {
      heading: string;
      description: string;
    };
    mission?: {
      heading: string;
      description: string;
    };
  } | null;
};

async function getAboutFromDb(): Promise<AboutContent | null> {
  const { data, error } = await supabase
    .from("lp_content")
    .select("content")
    .eq("id", ROW_ID)
    .single<ContentRow>();

  if (error || !data?.content?.about) {
    return null;
  }

  return {
    heading: data.content.about.heading,
    description: data.content.about.description,
  };
}

async function getMissionFromDb(): Promise<MissionContent | null> {
  const { data, error } = await supabase
    .from("lp_content")
    .select("content")
    .eq("id", ROW_ID)
    .single<ContentRow>();

  if (error || !data?.content?.mission) {
    return null;
  }

  return {
    heading: data.content.mission.heading,
    description: data.content.mission.description,
  };
}

async function getHeroFromDb(): Promise<HeroContent | null> {
  const { data, error } = await supabase
    .from("lp_hero")
    .select("heading, subheading, cta_label, cta_link, image_url")
    .eq("id", ROW_ID)
    .single<HeroRow>();

  if (error || !data) {
    return null;
  }

  return {
    heading: data.heading,
    subheading: data.subheading,
    ctaLabel: data.cta_label,
    ctaLink: data.cta_link,
    imageUrl: data.image_url,
  };
}

async function getServicesFromDb(): Promise<ServicesContent | null> {
  const [{ data: serviceRow, error: servicesError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabase
        .from("lp_services")
        .select("intro")
        .eq("id", ROW_ID)
        .single<ServiceRow>(),
      supabase
        .from("lp_service_items")
        .select("id, title, description, background_color, gallery, sort_order")
        .eq("services_id", ROW_ID)
        .order("sort_order", { ascending: true })
        .returns<ServiceItemRow[]>(),
    ]);

  if (servicesError || !serviceRow || itemsError || !items) {
    return null;
  }

  return {
    intro: serviceRow.intro,
    items: items.map(
      (item): ServiceItem => ({
        id: item.id,
        title: item.title,
        description: item.description,
        backgroundColor: item.background_color,
        gallery: item.gallery ?? [],
      })
    ),
  };
}

async function getPortfolioFromDb(): Promise<PortfolioContent | null> {
  const [{ data: meta, error: metaError }, { data: items, error: itemsError }] =
    await Promise.all([
      supabase
        .from("lp_portfolio")
        .select("heading, subheading")
        .eq("id", ROW_ID)
        .single<PortfolioRow>(),
      supabase
        .from("lp_portfolio_items")
        .select("id, title, description, image_url, link_url, sort_order")
        .eq("portfolio_id", ROW_ID)
        .order("sort_order", { ascending: true })
        .returns<PortfolioItemRow[]>(),
    ]);

  if (metaError || !meta || itemsError || !items) {
    return null;
  }

  return {
    heading: meta.heading,
    subheading: meta.subheading,
    items: items.map(
      (item): PortfolioItem => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        linkUrl: item.link_url ?? undefined,
      })
    ),
  };
}

export async function getLandingContent(): Promise<LandingContent> {
  const [hero, about, mission, services, portfolio] = await Promise.all([
    getHeroFromDb(),
    getAboutFromDb(),
    getMissionFromDb(),
    getServicesFromDb(),
    getPortfolioFromDb(),
  ]);

  return {
    hero: hero ?? FALLBACK_CONTENT.hero,
    about: about ?? FALLBACK_CONTENT.about,
    mission: mission ?? FALLBACK_CONTENT.mission,
    services: services ?? FALLBACK_CONTENT.services,
    portfolio: portfolio ?? FALLBACK_CONTENT.portfolio,
  };
}

async function saveHeroToDb(hero: HeroContent): Promise<void> {
  const { error } = await supabase.from("lp_hero").upsert(
    {
      id: ROW_ID,
      heading: hero.heading,
      subheading: hero.subheading,
      cta_label: hero.ctaLabel,
      cta_link: hero.ctaLink,
      image_url: hero.imageUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function saveServicesToDb(services: ServicesContent): Promise<void> {
  const { error: upsertError } = await supabase.from("lp_services").upsert(
    {
      id: ROW_ID,
      intro: services.intro,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  const { error: deleteError } = await supabase
    .from("lp_service_items")
    .delete()
    .eq("services_id", ROW_ID);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const rows =
    services.items.map((item, index) => ({
      id: item.id,
      services_id: ROW_ID,
      title: item.title,
      description: item.description,
      background_color: item.backgroundColor,
      gallery: item.gallery,
      sort_order: index,
    })) ?? [];

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from("lp_service_items")
      .insert(rows);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
}

async function savePortfolioToDb(portfolio: PortfolioContent): Promise<void> {
  const { error: upsertError } = await supabase.from("lp_portfolio").upsert(
    {
      id: ROW_ID,
      heading: portfolio.heading,
      subheading: portfolio.subheading,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  const { error: deleteError } = await supabase
    .from("lp_portfolio_items")
    .delete()
    .eq("portfolio_id", ROW_ID);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const rows =
    portfolio.items.map((item, index) => ({
      id: item.id,
      portfolio_id: ROW_ID,
      title: item.title,
      description: item.description,
      image_url: item.imageUrl,
      link_url: item.linkUrl ?? null,
      sort_order: index,
    })) ?? [];

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from("lp_portfolio_items")
      .insert(rows);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
}

async function saveAboutToDb(about: AboutContent): Promise<void> {
  const { data: existing } = await supabase
    .from("lp_content")
    .select("content")
    .eq("id", ROW_ID)
    .single<ContentRow>();

  const currentContent = existing?.content ?? {};
  const updatedContent = {
    ...currentContent,
    about: {
      heading: about.heading,
      description: about.description,
    },
  };

  const { error } = await supabase.from("lp_content").upsert(
    {
      id: ROW_ID,
      content: updatedContent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function saveMissionToDb(mission: MissionContent): Promise<void> {
  const { data: existing } = await supabase
    .from("lp_content")
    .select("content")
    .eq("id", ROW_ID)
    .single<ContentRow>();

  const currentContent = existing?.content ?? {};
  const updatedContent = {
    ...currentContent,
    mission: {
      heading: mission.heading,
      description: mission.description,
    },
  };

  const { error } = await supabase.from("lp_content").upsert(
    {
      id: ROW_ID,
      content: updatedContent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveLandingContent(
  content: LandingContent
): Promise<LandingContent> {
  await Promise.all([
    saveHeroToDb(content.hero),
    saveAboutToDb(content.about),
    saveMissionToDb(content.mission),
    saveServicesToDb(content.services),
    savePortfolioToDb(content.portfolio),
  ]);

  return content;
}

export { FALLBACK_CONTENT as DEFAULT_LANDING_CONTENT };

