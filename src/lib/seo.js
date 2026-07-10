export const SITE_URL = "https://gourav-takk-portfolio.vercel.app";
export const SITE_NAME = "Gourav Takk Portfolio";
export const OWNER_NAME = "Gourav Takk";
export const OWNER_EMAIL = "takkgourav@gmail.com";
export const OWNER_PHONE = "+91-6377093772";

export const defaultKeywords = [
  "Gourav Takk",
  "web developer Jodhpur",
  "frontend developer India",
  "React developer",
  "Next.js developer",
  "Tailwind CSS developer",
  "freelance web developer",
  "portfolio website developer",
  "responsive website developer",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function projectUrl(project) {
  return absoluteUrl(`/projects/${project.slug}`);
}

export function projectMetadata(project) {
  const title = `${project.title} Project`;
  const socialTitle = `${project.title} Project - ${OWNER_NAME}`;
  const description = project.seoDescription ?? project.overview ?? project.description;
  const url = projectUrl(project);
  const keywords = [...defaultKeywords, project.title, project.category, ...project.tech, ...project.features.slice(0, 3)];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: `${project.title} by ${OWNER_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
      images: ["/icon.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function projectJsonLd(project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: projectUrl(project),
    image: absoluteUrl("/icon.png"),
    creator: {
      "@type": "Person",
      name: OWNER_NAME,
      url: SITE_URL,
    },
    keywords: project.tech.join(", "),
    about: project.category,
  };
}
