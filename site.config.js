const CONFIG = {
  // profile setting (required)
  profile: {
    name: "Tan Phat Nguyen",
    image: "/avatar-03-01.svg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "AI Engineer",
    bio: "I'm a student who is passionate about AI and programming.",
    email: "tanphatnguyen2002@gmail.com",
    linkedin: "ntp-shin",
    github: "ntp-shin",
    instagram: "ntp_shin",
  },
  projects: [
    {
      name: `ntpshin`,
      href: "https://github.com/ntp-shin/ntpshin",
    },
  ],
  // blog setting (required)
  blog: {
    title: "Tan Phat Nguyen's Blog",
    description: "welcome to my channel =)))",
  },

  // CONFIG configration (required)
  link: "https://ntpshin.vercel.app",
  since: 2024, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: true,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      // repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      repo: "ntp-shin/ntpshin",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },  
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com", 
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 21600 * 7, // re-generate after 1 hour
}

module.exports = { CONFIG }
